const express = require("express");

const user_route = express.Router();
const {
  user_register_controller,
  user_login_controller,
  user_logout_controller,
  getMe_controller,
} = require("../controllers/user.controller");
const { protect, authLimiter } = require("../middlewares/auth.middleware");
const { csrfProtection } = require("../utils/csrf");
const { registerSchema, loginSchema } = require("../utils/authValidation");

const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message || "Invalid input.";
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }

  req.body = result.data;
  return next();
};

user_route.post("/register", authLimiter, csrfProtection, validateRequest(registerSchema), user_register_controller);
user_route.post("/login", authLimiter, csrfProtection, validateRequest(loginSchema), user_login_controller);

user_route.get("/logout", protect, user_logout_controller);
user_route.get("/me", protect, getMe_controller);

module.exports = user_route;
