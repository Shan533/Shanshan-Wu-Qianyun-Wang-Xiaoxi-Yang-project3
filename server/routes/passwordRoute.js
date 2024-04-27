const express = require('express');
const router = express.Router();
const PasswordModel = require('../models/passwordModel');
// const { generatePassword } = require('../utils/passwordGenerator');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const userId = decoded.userId;
    const passwords = await PasswordModel.find({ owner: userId });
    res.json(passwords);
  } catch (error) {
    console.error('Failed to fetch passwords:', error);
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const userId = decoded.userId;
    const { url, password } = req.body;
    const newPassword = new PasswordModel({
      url,
      password,
      owner: userId,
    });
    await newPassword.save();
    res.json({ message: 'Password saved successfully' });
  } catch (error) {
    console.error('Failed to save password:', error);
    res.status(500).json({ error: 'Failed to save password' });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const userId = decoded.userId;
    const { url, length, alphabet, numerals, symbols } = req.body;
    const generatedPassword = generatePassword(length, alphabet, numerals, symbols);
    const newPassword = new PasswordModel({
      url,
      password: generatedPassword,
      owner: userId,
    });
    await newPassword.save();
    res.json({ message: 'Password generated and saved successfully' });
  } catch (error) {
    console.error('Failed to generate password:', error);
    res.status(500).json({ error: 'Failed to generate password' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const userId = decoded.userId;

    const passwordId = req.params.id;
    const password = await PasswordModel.findById(passwordId);

    if (!password || password.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await PasswordModel.findByIdAndDelete(passwordId);
    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Failed to delete password:', error);
    res.status(500).json({ error: 'Failed to delete password' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const userId = decoded.userId;

    const passwordId = req.params.id;
    const { password } = req.body;

    const existingPassword = await PasswordModel.findById(passwordId);

    if (!existingPassword || existingPassword.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await PasswordModel.findByIdAndUpdate(passwordId, { password });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update password:', error);
    res.status(500).json({ error: 'Failed to update password' });
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