const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  resetPassword,
} = require("../controllers/userController");

const authentication = require("../middleware/authenticationMiddleware");

router.post("/register", registerUser);             
router.post("/login", loginUser);    
router.post('/forgetPassword/reset', resetPassword);                  
router.get("/profile", authentication, getProfile); 
router.put("/profile", authentication, updateProfile); 

module.exports = router;
