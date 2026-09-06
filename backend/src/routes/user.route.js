const express = require("express");
const user_route = express.Router();
const {
  user_register_controller,
  user_login_controller,
  user_logout_controller,
} = require("../controllers/user.controller");

user_route.post("/register", user_register_controller);
user_route.post("/login", user_login_controller);
user_route.get("/logout", user_logout_controller);

module.exports = user_route;
