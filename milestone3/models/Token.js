const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 3600 }
  });


const Token = mongoose.model('token', tokenSchema);

module.exports = Token;