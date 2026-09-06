const express = require("express");
const user_route = require("./routes/user.route");
const app = express();



app.use(express.json());
app.use("/auth",user_route);




module.exports = app;