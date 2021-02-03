const mongoose = require('mongoose');
const { isEmail, isInt } = require('validator');
const reportSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
       
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      },

      no: { type: String,
        validate: [isInt , 'Please enter a valid value']},

    monthlyUsage: [String]
  });
  

const Report = mongoose.model('report', reportSchema);

module.exports = Report;