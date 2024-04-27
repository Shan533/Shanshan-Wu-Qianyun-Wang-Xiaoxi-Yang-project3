const express = require('express');
const router = express.Router();
const ShareRequestModel = require('../models/shareRequestModel');
const PasswordModel = require('../models/passwordModel');
const UserModel = require('../models/userModel');
const { authenticateUser } = require('../middlewares/authentication');

// Send a share request
router.post('/send', authenticateUser, async (req, res) => {
  try {
    const { recipient } = req.body;
    const sender = req.user._id;

    // Check if the recipient exists
    const recipientUser = await UserModel.findOne({ username: recipient });
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
    });

    await shareRequest.save();

    res.status(201).json({ message: 'Share request sent successfully' });
  } catch (error) {
    console.error('Failed to send share request:', error);
    res.status(500).json({ error: 'Failed to send share request' });
  }
});

// Get all share requests for the logged-in user
router.get('/requests', authenticateUser, async (req, res) => {
  try {
    const recipient = req.user._id;

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
router.put('/accept/:requestId', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const recipient = req.user._id;

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
    await PasswordModel.updateMany(
      { owner: shareRequest.sender },
      { $addToSet: { sharedWith: recipient } }
    );

    res.json({ message: 'Share request accepted successfully' });
  } catch (error) {
    console.error('Failed to accept share request:', error);
    res.status(500).json({ error: 'Failed to accept share request' });
  }
});

// Reject a share request
router.put('/reject/:requestId', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const recipient = req.user._id;

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

module.exports = router;