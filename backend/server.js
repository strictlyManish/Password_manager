require("dotenv").config();
const app = require("./src/app");
const connect_DB = require("./src/db/db");

try {
    connect_DB();
  app.listen(process.env.PORT, function () {
    console.log("server runnig smoothly..");
  });
} catch (error) {
    console.log("it's 500");
}
