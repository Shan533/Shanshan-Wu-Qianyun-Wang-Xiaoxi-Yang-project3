const express = require("express");
const router = express.Router();
const Password = require("../models/passwordModel");
const Message = require("../models/messageModel");

// Create a new password
router.post("/", async (req, res) => {
  try {
    const { url, password, alphabet, numerals, symbols, length } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let generatedPassword = password;

    if (!password && (alphabet || numerals || symbols) && length >= 4 && length <= 50) {
      generatedPassword = generatePassword(alphabet, numerals, symbols, length);
    }

    const newPassword = new Password({
      user: req.user._id,
      website: url,
      password: generatedPassword,
    });

    const savedPassword = await newPassword.save();
    res.status(201).json(savedPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all passwords for a user
router.get("/", async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user._id });
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a password
router.put("/:passwordId", async (req, res) => {
  try {
    const { password } = req.body;

    const updatedPassword = await Password.findOneAndUpdate(
      { _id: req.params.passwordId, user: req.user._id },
      { password },
      { new: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ error: "Password not found" });
    }

    res.json(updatedPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a password
router.delete("/:passwordId", async (req, res) => {
  try {
    const deletedPassword = await Password.findOneAndDelete({
      _id: req.params.passwordId,
      user: req.user._id,
    });

    if (!deletedPassword) {
      return res.status(404).json({ error: "Password not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Share a password
router.post("/share", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const receiverUser = await User.findOne({ username });

    if (!receiverUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (receiverUser._id.equals(req.user._id)) {
      return res.status(400).json({ error: "Cannot share with yourself" });
    }

    const newMessage = new Message({
      sentUser: req.user._id,
      receiveUser: receiverUser._id,
    });

    await newMessage.save();
    res.json({ message: "Share request sent" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Accept or reject a shared password
router.put("/share/:messageId", async (req, res) => {
  try {
    const { action } = req.body;

    if (!action || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const message = await Message.findOne({
      _id: req.params.messageId,
      receiveUser: req.user._id,
      status: "pending",
    });

    if (!message) {
      return res.status(404).json({ error: "Share request not found" });
    }

    if (action === "accept") {
      await Password.updateMany(
        { user: message.sentUser },
        { $addToSet: { sharedWith: req.user._id } }
      );
      message.status = "accepted";
    } else {
      message.status = "rejected";
    }

    await message.save();
    res.json({ message: "Share request updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to generate a random password
function generatePassword(alphabet, numerals, symbols, length) {
  const characters = [];
  if (alphabet) characters.push(...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)));
  if (numerals) characters.push(...Array.from({ length: 10 }, (_, i) => i.toString()));
  if (symbols) characters.push("!", "@", "#", "$", "%", "^", "&", "*");

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

module.exports = router;