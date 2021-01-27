const mongoose = require('mongoose');
const { isEmail, isAlpha, isInt } = require('validator');

const tankSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
       
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      },

    no: {
        type: String,
        validate: [isInt , 'Please enter a valid value']
        },

    tds:{
        type: String,
        required: [true, 'Please enter tds count'],
        validate: [isInt , 'Please enter a valid value']
    },

    turbidity:{
        type: String,
        required: [true, 'Please enter turbidity count'],
        validate: [isInt , 'Please enter a valid value']
    },

    level:{
        type: String,
        required: [true, 'Please enter level'],
        validate: [isInt , 'Please enter a valid value']
    },

    usage:{
        type: String,
        required: [true, 'Please enter usage'],
        validate: [isInt , 'Please enter a valid value']
    },
    
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
  });

  tankSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) 
    {
        this.created_at = now
    }
    next();
});


const Tank = mongoose.model('tank', tankSchema);

module.exports = Tank;