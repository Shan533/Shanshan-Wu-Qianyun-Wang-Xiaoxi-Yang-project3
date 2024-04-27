const express = require('express');
const router = express.Router();
const ShareRequestModel = require('../models/shareRequestModel');
const PasswordModel = require('../models/passwordModel');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Send a share request
router.post('/send', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const sender = decoded.userId;
    const { recipient, passwordId } = req.body;

    // Check if the recipient exists
    const recipientUser = await UserModel.getUserByUsername(recipient);
    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check if the sender is trying to share with themselves
    if (sender.toString() === recipientUser._id.toString()) {
      return res.status(400).json({ error: 'Cannot share with yourself' });
    }

    // Create a new share request
    const shareRequest = new ShareRequestModel({
      sender,
      recipient: recipientUser._id,
      password: passwordId,
    });

    await shareRequest.save();

    res.status(201).json({ message: 'Share request sent successfully' });
  } catch (error) {
    console.error('Failed to send share request:', error);
    res.status(500).json({ error: 'Failed to send share request' });
  }
});

// Get all share requests for the logged-in user
router.get('/requests', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const recipient = decoded.userId;

    const shareRequests = await ShareRequestModel.find({ recipient })
      .populate('sender', 'username')
      .exec();

    res.json(shareRequests);
  } catch (error) {
    console.error('Failed to fetch share requests:', error);
    res.status(500).json({ error: 'Failed to fetch share requests' });
  }
});

// Accept a share request
router.put('/accept/:requestId', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const recipient = decoded.userId;

    const { requestId } = req.params;

    const shareRequest = await ShareRequestModel.findOne({
      _id: requestId,
      recipient,
    });

    if (!shareRequest) {
      return res.status(404).json({ error: 'Share request not found' });
    }

    shareRequest.status = 'accepted';
    await shareRequest.save();

    // Update the passwords to include the recipient in the sharedWith array
    await PasswordModel.updateOne(
      { _id: shareRequest.password },
      { $addToSet: { sharedWith: recipient } }
    );

    res.json({ message: 'Share request accepted successfully' });
  } catch (error) {
    console.error('Failed to accept share request:', error);
    res.status(500).json({ error: 'Failed to accept share request' });
  }
});

// Reject a share request
router.put('/reject/:requestId', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const recipient = decoded.userId;

    const { requestId } = req.params;

    const shareRequest = await ShareRequestModel.findOne({
      _id: requestId,
      recipient,
    });

    if (!shareRequest) {
      return res.status(404).json({ error: 'Share request not found' });
    }

    shareRequest.status = 'rejected';
    await shareRequest.save();

    res.json({ message: 'Share request rejected successfully' });
  } catch (error) {
    console.error('Failed to reject share request:', error);
    res.status(500).json({ error: 'Failed to reject share request' });
  }
});

// Get shared passwords for the logged-in user
router.get('/shared', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.jwt_secret);
    const userId = decoded.userId;

    const sharedPasswords = await PasswordModel.find({ sharedWith: userId }).populate('owner', 'username');

    res.json(sharedPasswords);
  } catch (error) {
    console.error('Failed to fetch shared passwords:', error);
    res.status(500).json({ error: 'Failed to fetch shared passwords' });
  }
});

module.exports = router;