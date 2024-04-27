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
    
    if (!alphabet && !numerals && !symbols) {
      return res.status(400).json({ error: 'At least one character type must be selected' });
    }
    if (length < 4 || length > 50) {
      return res.status(400).json({ error: 'Length must be between 4 and 50' });
    }

    const generatedPassword = generatePassword(alphabet, numerals, symbols, length);
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
  if (symbols) characters.push('!', '@', '#', '$', '%', '^', '&', '*');

  let password = '';

  // Ensure at least one character from each selected type is included
  if (alphabet) password += getRandomCharacter(characters.slice(0, 26));
  if (numerals) password += getRandomCharacter(characters.slice(26, 36));
  if (symbols) password += getRandomCharacter(characters.slice(36));

  // Generate the remaining characters randomly
  for (let i = password.length; i < length; i++) {
    password += getRandomCharacter(characters);
  }

  // Shuffle the password characters to ensure randomness
  password = shuffleString(password);

  return password;
}

// Helper function to get a random character from an array
function getRandomCharacter(characters) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

// Helper function to shuffle the characters in a string
function shuffleString(string) {
  const arr = string.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

module.exports = router;