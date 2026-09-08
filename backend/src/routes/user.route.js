const express = require("express");
const user_route = express.Router();
const {
  user_register_controller,
  user_login_controller,
  user_logout_controller,
  getMe_controller,
} = require("../controllers/user.controller");
const { protect, authLimiter } = require("../middlewares/auth.middleware");

user_route.post("/register", authLimiter, user_register_controller);
user_route.post("/login", authLimiter, user_login_controller);

user_route.get("/logout", protect, user_logout_controller);
user_route.get("/me", protect, getMe_controller);

module.exports = user_route;
