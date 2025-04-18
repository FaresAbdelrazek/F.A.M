
const express = require('express');
const router  = express.Router();

const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
} = require('../controllers/userController');

const { verifyToken } = require('../middleware/authMiddleware');


router.post('/register',       registerUser);
router.post('/login',          loginUser);
router.put( '/forgetPassword', requestPasswordReset);
router.put( '/resetPassword',  resetPassword);


router.get( '/profile',        verifyToken, getProfile);
router.put( '/profile',        verifyToken, updateProfile);

module.exports = router;
