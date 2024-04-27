const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const PasswordModel = mongoose.model('Password', passwordSchema);

module.exports = PasswordModel;