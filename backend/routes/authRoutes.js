const express = require('express');
const router  = express.Router();
const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword
} = require('../controllers/userController');

router.post('/register',         registerUser);
router.post('/login',            loginUser);
router.post('/forgot-password',  requestPasswordReset);  // Fixed: POST instead of PUT
router.post('/reset-password',   resetPassword);         // Fixed: POST instead of PUT

module.exports = router;