const User = require("../models/User");
const customer = require("../models/customer");
const Token = require("../models/Token");
const Tank = require("../models/Tank");
const Report = require("../models/Report");

var crypto = require('crypto');
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '',firstname: '',lastname: '',contact: '',address: '',area: '',tanks: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already used by a registered user';
    return errors;
  }

  // validation errors
  if (err.message.toLowerCase().includes('validation failed')) {
   
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  
  return errors;
}

// create json web token
const maxAge = 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

module.exports.notice_post = async (req, res) => {
  const { email, topic, message } = req.body;

  if(!message)
  {
    res.status(400).json({"results": "message not found"});
  }
  if(!topic)
  {
    res.status(401).json({"results": "topic not found"});
  }


  customer
 .find({
  email: email   // search query
 },{ "_id":0, "__v": 0, "area": 0, "email": 0, "tanks": 0})
 .then(results => {
   if(results[0])
   {
    try
    {
      
      
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'watermonitor13@gmail.com',
          pass: 'e16388com'
        }
      });
  
      var mailOptions = { from: 'watermonitor13@gmail.com', 
      to: email, subject: topic, 
      text: message };
  
  transporter.sendMail(mailOptions, function(error, info)
    {
    if (error) 
      {
        console.log(error);
      } 
    else 
      {
        console.log('Email sent: ' + info.response);
      }
    }); 
  
     
      res.status(200).json({ message : "email sent" });
    }
    catch(err) 
    { 
      console.log(err);
      res.status(400).json({ err });
    } 
   } 
   else
   {
    res.status(404).json({"results": "not found"});
   }
 })
 .catch(err => {
   console.error(err)
 })
  
  console.log(req.body)


 



}



module.exports.name_get = (req, res) => {
  const email = req.params.id; 
  customer
 .find({
  email: email   // search query
 },{ "_id":0, "__v": 0, "area": 0, "email": 0, "tanks": 0})
 .then(results => {
   if(results[0])
   {
    console.log(results[0])
    res.status(200).json({"results": results});
   } 
   else
   {
    res.status(404).json({"results": "not found"});
   }
 })
 .catch(err => {
   console.error(err)
 })
}


module.exports.area_get = (req, res) => {
  const area = req.params.id; 
  customer
 .find({
  area: area   // search query
 },{ "_id":0, "__v": 0, "area": 0, "email": 0, "tanks": 0})
 .then(results => {
   if(results[0])
   {
    console.log(results[0])
    res.status(200).json({results: results});
    //res.status(200).json({"results": "wok"});

   } 
   else
   {
    res.status(404).json({results: "not found"});
   }
 })
 .catch(err => {
   console.error(err)
 })
}






module.exports.removeAdmin_delete = (req, res)  => {
  console.log("remove admin")
  if(req.params.id)
  {
    User.deleteOne({email: req.params.id, role: 'admin' }, function (err, results) {
      if (err) 
      {
        console.log(err);
      }
      if(results.deletedCount == 0)
      {
        res.status(404).json({'msg' : 'This User Does Not Exist!'});
      }
      else
      {
        Tank.deleteMany({email: req.params.id }, function (err, res) {
          if (err) 
          {
            console.log(err);
          }
        });
        customer.deleteOne({email: req.params.id }, function (err, res) {
          if (err) 
          {
            console.log(err);
          }
        });
        Report.deleteMany({email: req.params.id }, function (err, res) {
          if (err) 
          {
            console.log(err);
          }
        });
        res.status(200).json({'msg' : 'Admin was Removed From System!'});
      }
    });
  }

  else
  {
    res.status(401).json({'msg' : 'Please Enter a Valid Email!'});
  }

}

module.exports.readings_put = (req, res) => {
  const tank =  JSON.parse(req.params.id); 
  const filter = {email: tank.email, no: tank.no};
  Tank.updateOne(filter, req.body , { runValidators: true }, function(err,
    result)
    {
      if (err) 
        {
          res.send({'response' : 400});
        } 
      else 
        { 
          res.send({'response' : 200});
        }
    });
}

module.exports.user_put = (req, res) => {
  
  const filter = { email : req.body.email};
  //const update = {firstname : req.body.firstname ,lastname: req.body.lastname, contact: req.body.contact, address: req.body.address};
  
  console.log(req.body)

try
{
  
  customer.updateOne(filter, req.body, { runValidators: true }, function(err,
    result)
    {
      if (err) 
        {
          const errors = handleErrors(err);
          console.log("errors: "+err)
          res.status(400).json({ 'error': errors });
        } 
        else 
        {
         if(result.nModified == 0 && result.n == 1) 
            {'Theese are Existing Values!'
              res.status(406).json({'msg' : 'Theese are Existing Values!'});
            }
         else if(result.nModified == 0 && result.n == 0)
            {
              res.status(404).json({'msg' : 'There are No Exsiting Customer Under this Email!'});
            }
            else
            {
              res.status(200).json({'msg' : 'Customer was Updated!'});
            }
          
        }
    });
}
catch (err)
{
  const errors = handleErrors(err);
    
  res.status(400).json({'error': errors });
}











}


module.exports.remove_delete = (req, res) => {
  if(req.params.id)
  {
    User.deleteOne({email: req.params.id, role: 'user' }, function (err, results) {
      if (err) 
      {
        console.log(err);
      }
      if(results.deletedCount == 0)
      {
        res.status(404).json({'msg' : 'This User Does Not Exist!'});
      }
      else
      {
        Tank.deleteMany({email: req.params.id }, function (err, res) {
          if (err) 
          {
            console.log(err);
          }
        });
        customer.deleteOne({email: req.params.id }, function (err, res) {
          if (err) 
          {
            console.log(err);
          }
        });
        Report.deleteMany({email: req.params.id }, function (err, res) {
          if (err) 
          {
            console.log(err);
          }
        });
        res.status(200).json({'msg' : 'User was Removed From System!'});
      }
    });


  }
  else
  {
    res.status(401).json({'msg' : 'Please Enter a Valid Email!'});
  }

}


module.exports.userStatistics_get = (req, res, next) => {
  console.log("userStatistics_get");

  const token = req.cookies.jwt;

  if (token) 
  {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) 
      {
        res.locals.user = null;
        next();
      } 
      else 
      {
        let user = await User.findById(decodedToken.id);

        Report.find({
              email: user.email   // search query
            },{ "_id":0, "email": 0, "__v": 0})
            .then(doc => {
              
              console.log("tanks: "+doc)
              res.status(200).json({ details: doc });
             
            })
            .catch(err => {
              console.error(err)
              res.status(400).json({ err: "error" });
            })

        
        
      }
    });
  } 
  else 
  {
    res.locals.user = null;
    next();
  }



}




module.exports.report_get = (req, res) => {

  Tank.find({
        issue: true   // search query
      },{ "_id":0, "level": 0, "usage": 0, "issue": 0, "created_at": 0, "__v": 0})
      .then(doc => {
        
        console.log("isues: "+doc)
        res.status(200).json({ details: doc });
        //res.render("home", { details: doc })
      })
      .catch(err => {
        console.error(err)
        res.status(400).json({ err: "error" });
      })  
}

module.exports.userData_get = (req, res, next) => {
  console.log("get user data");

  const token = req.cookies.jwt;

  if (token) 
  {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) 
      {
        res.locals.user = null;
        next();
      } 
      else 
      {
        let user = await User.findById(decodedToken.id);

        Tank.find({
              email: user.email   // search query
            })
            .then(doc => {
              
              console.log("tanks: "+doc)
              res.status(200).json({ details: doc });
             
            })
            .catch(err => {
              console.error(err)
              res.status(400).json({ err: "error" });
            })

        
        
      }
    });
  } 
  else 
  {
    res.locals.user = null;
    next();
  }



}







module.exports.userReg_post = async (req, res) => {
  
  

  const { firstname, lastname, contact, address, area, tanks, email } = req.body;


  try 
  { 
    const user = await customer.create({ firstname, lastname, contact, address, area, tanks, email });

    if(user)
    {
      try
      {  
        const initial = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (var i = 0; i < user.tanks; i++) 
        {
          const r = await Report.create({email: user.email, no: i + 1, monthlyUsage: initial});
          const t = await Tank.create({email: user.email, area: user.area, no: i + 1, usage: '0'});          
        } 
        

      }
      catch(err)
      {
        console.log(err);
      }
    }
    console.log(user);
    res.status(201).json({ user: user });
  }

catch(err) 
  { 
    
    const errors = handleErrors(err);
    
    res.status(400).json({ errors });
  }
}




// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.adminSignup_get = (req, res) => {
  res.render('adminSignup');
}

module.exports.restricted_get = (req, res) => {
  
  res.render('restricted');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.userReg_get = (req, res) => {
  res.render('userReg');
}



module.exports.adminSignup_post = async (req, res) => {
  const { email, password, role } = req.body;
  
  try 
  {
    const user = await User.create({ email, password, role });
    const token = createToken(user._id);
    console.log(user);

    try
    {
      const cnfrmToken = await Token.create({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
      
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'watermonitor13@gmail.com',
          pass: 'e16388com'
        }
      });

      var mailOptions = { from: 'watermonitor13@gmail.com', 
      to: user.email, subject: 'Account Verification Token', 
      text: 'Hello,\n\n' + 'Please verify your administrative account by clicking the link: \nhttps:\/\/' + req.headers.host + '\/confirmation\/' + cnfrmToken.token + '.\n' };

transporter.sendMail(mailOptions, function(error, info)
    {
    if (error) 
      {
        console.log(error);
      } 
    else 
      {
        console.log('Email sent: ' + info.response);
      }
    }); 

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user });
    }
    catch(err) 
    { 
      console.log(err);
      res.status(400).json({ err });
    }    

  }
  catch(err) 
  {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}










module.exports.signup_post = async (req, res) => {
  const { email, password, role } = req.body;
  
  try 
  {
    const user = await User.create({ email, password, role });
    const token = createToken(user._id);
    console.log(user);

    try
    {
      const cnfrmToken = await Token.create({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
      
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'watermonitor13@gmail.com',
          pass: 'e16388com'
        }
      });

      var mailOptions = { from: 'watermonitor13@gmail.com', 
      to: user.email, subject: 'Account Verification Token', 
      text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttps:\/\/' + req.headers.host + '\/confirmation\/' + cnfrmToken.token + '.\n' };

transporter.sendMail(mailOptions, function(error, info)
    {
    if (error) 
      {
        console.log(error);
      } 
    else 
      {
        console.log('Email sent: ' + info.response);
      }
    }); 

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: true });
      res.status(201).json({ user: user });
    }
    catch(err) 
    { 
      console.log(err);
      res.status(400).json({ err });
    }    

  }
  catch(err) 
  {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}









module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log("login request")
  try 
  {
    const user = await User.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: true });
    res.status(200).json({ user: user });
   } 
  catch (err) 
  {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}




















module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}



module.exports.confirmation_Post = async (req, res) => {
  
if(req.params.id)
{
  Token.findOne({ token: req.params.id }, function (err, token) {

    
    if (!token)
    {
     
     res.status(400).send({ msg: 'Token is not verified.' });
    }
    else
    { 
      

      User.findOne({ _id: token._userId}, function (err, user) {
        if (!user)  
         return res.status(400).send({ msg: 'We were unable to find a user for this token.' });

        if (user.isVerified)  
         return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

        else
        {
          User.updateOne({ _id: token._userId }, { isVerified: true }, function(err,
            result)
            {
              if (err) 
                {
                  res.send(err);
                } 
              else 
                {
                 if(user.role.toString() == "user") 
                    {
                      res.redirect('/userReg');
                    }
                    else
                    {
                      res.redirect('/');
                    }
                  
                }
            });

        }
        
        
    });
    }

   
}


);

}



}