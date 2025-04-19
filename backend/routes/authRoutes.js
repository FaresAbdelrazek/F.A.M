const express = require('express');
const router  = express.Router();
const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword
} = require('../controllers/userController');

router.post('/register',       registerUser);
router.post('/login',          loginUser);
router.put( '/forgetPassword', requestPasswordReset);
router.put( '/resetPassword',  resetPassword);

module.exports = router;
