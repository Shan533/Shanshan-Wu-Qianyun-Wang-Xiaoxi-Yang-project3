const mongoose = require("mongoose");
const model = require("mongoose").model;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("users", userSchema);
const UserModel = model("User", userSchema);

function insertUser(user) {
  return UserModel.create(user);
}

function getUserByUsername(username) {
  return UserModel.findOne({ username: username }).exec();
}

function getUserById(userId) {
  return UserModel.findById(userId).exec();
}

module.exports = {
  insertUser,
  getUserByUsername,
  getUserById,
};
