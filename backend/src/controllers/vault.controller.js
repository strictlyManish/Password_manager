const Vault = require("../model/vault.model");

async function CreateNewCollection(req, res) {
  try {
    const { category, name, password, url, username } = req.body;

    if (!category || !name || !password || !url || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingCollection = await Vault.findOne({ name });

    if (existingCollection) {
      return res.status(409).json({
        success: false,
        message: "A collection with this name already exists.",
      });
    }

    const newcolletion = await Vault.create({
      user: req.user._id,
      category,
      name,
      password,
      url,
      username,
    });

    return res.status(201).json({
      success: true,
      message: "Collection created successfully.",
      data: newcolletion,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A collection with this name already exists.",
      });
    }

    console.error("Error creating collection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

async function UpdateCollection(req, res) {
  try {
    const { id } = req.params;
    const { category, name, password, url, username } = req.body;

    // 1. Check if the updated name already belongs to another entry
    if (name) {
      const existingCollection = await Vault.findOne({
        name,
        _id: { $ne: id }, // Exclude the current item being updated
      });

      if (existingCollection) {
        return res.status(409).json({
          success: false,
          message: "A collection with this name already exists.",
        });
      }
    }

    const updatedCollection = await Vault.findByIdAndUpdate(
      id,
      { category, name, password, url, username },
      { new: true, runValidators: true },
    );

    // 3. Return 404 if the item doesn't exist
    if (!updatedCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Collection updated successfully.",
      data: updatedCollection,
    });
  } catch (error) {
    // 4. Handle unique index violation (code 11000) or invalid ObjectId format
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A collection with this name already exists.",
      });
    }

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid collection ID format.",
      });
    }

    console.error("Error updating collection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

async function ReadController(req, res) {
  try {
    const { id } = req.params;

    const collection = await Vault.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid collection ID format.",
      });
    }

    console.error("Error fetching collection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

async function DeleteCollection(req, res) {
  try {
    const { id } = req.params;

    const deletedCollection = await Vault.findByIdAndDelete(id);

    if (!deletedCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully.",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid collection ID format.",
      });
    }

    console.error("Error deleting collection:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

async function GetAllCollections(req, res) {
  try {
    const collections = await Vault.find({ user: req.user._id });

    return res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

module.exports = {
  CreateNewCollection,
  UpdateCollection,
  ReadController,
  DeleteCollection,
  GetAllCollections,
};
