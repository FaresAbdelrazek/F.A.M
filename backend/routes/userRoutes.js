const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const authentication = require("../middleware/authenticationMiddleware");

router.post("/register", registerUser);             
router.post("/login", loginUser);                      
router.get("/profile", authentication, getProfile); 
router.put("/profile", authentication, updateProfile); 

module.exports = router;
