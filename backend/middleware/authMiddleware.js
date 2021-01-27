const jwt = require('jsonwebtoken');
const User = require('../models/User');


const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) 
  {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) 
      {
        console.log(err.message);
        res.redirect('/login');
      } 
      else 
      {
        //console.log(decodedToken);
        next();
      }
    });
  } 
  else 
  {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
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
        res.locals.user = user;
        next();
      }
    });
  } 
  else 
  {
    res.locals.user = null;
    next();
  }
};




// check current user role
const checkadmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) 
  {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) 
      {
        console.log(err.message);
        res.redirect('/login');
      } 
      else 
      {
        let user = await User.findById(decodedToken.id);
        console.log(user.role && user.isVerified);
        if (user.role.toString() == "admin") 
        {
          next();
        }
        else
        {
          res.redirect('/restricted');
        }
      }
    });
  } 
  else 
  {
    res.redirect('/login');
  }
};


// check current user role
const checkSuperadmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) 
  {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) 
      {
        console.log(err.message);
        res.redirect('/login');
      } 
      else 
      {
        let user = await User.findById(decodedToken.id);
        console.log(user.role);

        if (user.role.toString() == "super" && user.isVerified) 
        {
          next();
        }
        else
        {
          res.redirect('/restricted');
        }
      }
    });
  } 
  else 
  {
    res.redirect('/login');
  }
};





// check current user role
const verifiedAccount = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) 
  {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) 
      {
        console.log(err.message);
        res.redirect('/login');
      } 
      else 
      {
        let user = await User.findById(decodedToken.id);
        //console.log(user.isVerified);
        
        if (user.isVerified) 
        {
          next();
        }
        else
        { 
          res.redirect('/confirm');
        }
      }
    });
  } 
  else 
  {
    res.redirect('/login');
  }
};
module.exports = { requireAuth, checkUser, checkadmin, checkSuperadmin, verifiedAccount};
