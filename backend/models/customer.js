const mongoose = require('mongoose');
const { isEmail, isAlpha, isInt } = require('validator');


const customerSchema = new mongoose.Schema({
  firstname: {
      type: String,
      required: [true, 'Please enter a name'],      
      lowercase: true,
      maxlength: [20, 'Maximum password length is 20 characters'],
      validate: [isAlpha, 'Please enter a valid name']
    },
    lastname: {
      type: String,
      required: [true, 'Please enter a name'],
      lowercase: true,
      maxlength: [20, 'Maximum name length is 20 characters'],
      validate: [isAlpha, 'Please enter a valid name']
    },
    contact: {
      type: String,
      required: [true, 'Please enter the contact number'],
      minlength: [10, 'Minimum password length is 10 characters'],
      maxlength: [10, 'Maximum password length is 10 characters'],
      validate: [isInt , 'Please enter a valid telephone number']
    
 
    },

    address: {
        type: String,
        required: [true, 'Please enter the address'],
        lowercase: true,
        maxlength: [100, 'Maximum password length is 100 characters'],

      
       // validate: [roleValidator, 'Please enter a valid role']
      },

      area: {
        type: String,
        required: [true, 'Please enter the area'],
        maxlength: [100, 'Maximum password length is 20 characters'],
        lowercase: true,
        validate: [isAlpha, 'Please enter a valid area name']
      },
      tanks:{
          type: String,
          required: [true, 'Please enter number of tanks'],
          validate: [isInt , 'Please enter a valid value']
      },

      email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      }
    
  });
  
  const customer = mongoose.model('customer', customerSchema);

module.exports = customer;
  