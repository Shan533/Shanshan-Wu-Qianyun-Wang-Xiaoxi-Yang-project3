const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiveUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedPassword: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Password",
    required: true,
  },
  sharedState: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
