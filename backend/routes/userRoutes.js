const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const authentication = require("../middleware/authenticationMiddleware");

router.post("/register", registerUser);             // Public
router.post("/login", loginUser);                   // Public
router.get("/profile", authentication, getProfile); // Authenticated
router.put("/profile", authentication, updateProfile); // Authenticated

module.exports = router;
