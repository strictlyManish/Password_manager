const express = require("express");

const user_route = require("./routes/user.route");
const vault_route = require("./routes/vault.route");

const app = express();
const cookiParser = require("cookie-parser");
const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json()); 
app.use(cookiParser());

app.use("/auth",user_route);
app.use("/vault",vault_route)



module.exports = app;