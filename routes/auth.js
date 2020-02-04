const express       = require('express');
const router        = express.Router();
const User          = require('../models/User');

const bcrypt        = require('bcrypt');
const saltRounds    = 10;





//  POST    '/signup'
router.post(
    '/signup',
    isNotLoggedIn,
    validationLoggin,
    async (req, res, next) => {
      const { fullName, email, password, location, keywords } = req.body;
  
      try {
        // projection
        const emailExists = await User.findOne({ email }, 'email');
  
        if (emailExists) return next(createError(400));
        else {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashPass = bcrypt.hashSync(password, salt);
          const newUser = await User.create({ fullName, email, password: hashPass, location, keywords });
          req.session.currentUser = newUser;
          res
            .status(200) //  OK
            .json(newUser);
        }
      } catch (error) {
        next(error);
      }
    },
  );