const User = require("../models/User");
const customer = require("../models/customer");
const Token = require("../models/Token");
const Tank = require("../models/Tank");

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
  if (err.message.includes('validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  
  return errors;
}

// create json web token
const maxAge = 20 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};


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
              //res.render("home", { details: doc })
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
    res.status(404).json({ err: "error" });
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
        for (var i = 0; i < user.tanks; i++) 
        {
          const t = await Tank.create({email: user.email, no: i + 1, tds:0, turbidity:0, level:0, usage:0  });
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
      text: 'Hello,\n\n' + 'Please verify your administrative account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + cnfrmToken.token + '.\n' };

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
      text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + cnfrmToken.token + '.\n' };

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









module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try 
  {
    const user = await User.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
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