const mongoose = require('mongoose');
const { isEmail, isAlpha, isInt } = require('validator');
const Report = require("./Report");

const tankSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
       
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      },

    area: {
        type: String,
        required: [true, 'Please enter an area'],       
        lowercase: true
      },

    no: {
        type: String,       
        validate: [isInt , 'Please enter a valid value']

        },
    
    tds:{
        type: String,
        required: [true, 'Please enter tds count'],
        validate: [isInt , 'Please enter a valid value'],
        default: '0'
    },

    turbidity:{
        type: String,
        required: [true, 'Please enter turbidity count'],
        validate: [isInt , 'Please enter a valid value'],
        default: '0'
    },

    level:{
        type: String,
        required: [true, 'Please enter level'],
        validate: [isInt , 'Please enter a valid value'],
        default: '0'
    },

    usage:{
        type: String,
        required: [true, 'Please enter usage'],
        validate: [isInt , 'Please enter a valid value'],
        default: '0'
    },

    issue:{
        type: Boolean,
        default: false
    },
    
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
  });

 






  tankSchema.pre('updateOne', function(next){
    now = new Date();

   
    email = this._conditions.email;
    no = this._conditions.no
    day = ((now).getDate());
    dailyUsage = this._update.usage

    Report.find({
        email: email, no : no // search query
      },{ "_id":0, "email": 0, "__v": 0})

      .then(report => {
        data = report[0].monthlyUsage;
        
        if(day == 1)
        {   console.log("reset")
            for(i = 0; i < 31; i++)
            {
                data[i] = 0;
            }
        }
        data[day - 1] = dailyUsage;  
        
        Report.updateOne({email: email, no : no}, {monthlyUsage: data} , { runValidators: true }, function(err,
          result)
          {
            if (err) 
              {
                console.log(err);
              } 
            else 
              { 
                console.log("Done!");
              }
          });




      })
      .catch(err => {
        console.error(err)
        //res.status(400).json({ err: "error" });
      }) 

      next();
  });











     /*
    now = new Date();

    email = this.email;
    no = this.no;
    day = ((now).getDate());

    Report.find({
        email: email, no : no // search query
      },{ "_id":0, "email": 0, "__v": 0})

      .then(report => {
        data = report.monthlyUsage;

        if(day == 1)
        {
            for(i = 0; i < 31; i++)
            {
                data[i] = 0;
            }
        }

        console.log(typeof(data))
        console.log("28: "+ this.usage)
        data[day - 1] = this.usage;
        

        Report.updateOne({ email: email, no: no }, { monthlyUsage: data }, function(err,
            result)
            {
              if (err) 
                {
                  console.error(err);
                } 
              else 
                {
                    console.log("successfully updated");
                }
            });
      })
      .catch(err => {
        console.error(err)
        //res.status(400).json({ err: "error" });
      })

*/







tankSchema.pre('updateOne', function(next) {
  
  if(this._update.tds > 200 || this._update.turbidity > 5)
  {
    this.set({ issue:true });
  }
  this.set({ updated_at: new Date() });
  next();
});


  tankSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) 
    {   
        this.created_at = now
    }
    console.log("updated")

    next();
    });


const Tank = mongoose.model('tank', tankSchema);

module.exports = Tank;