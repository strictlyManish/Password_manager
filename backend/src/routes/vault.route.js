const express = require("express");
const {
  CreateNewCollection,
  UpdateCollection,
  ReadController,
  DeleteCollection,
  GetAllCollections,
} = require("../controllers/vault.controller");
const { protect, Handler } = require("../middlewares/auth.middleware");

const vault_route = express.Router();

vault_route.use(protect, Handler);

vault_route.route("/")
  .get(GetAllCollections)
  .post(CreateNewCollection);

vault_route.route("/:id")
  .get(ReadController)
  .put(UpdateCollection)
  .delete(DeleteCollection);

module.exports = vault_route;