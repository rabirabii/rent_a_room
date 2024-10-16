const express = require("express");
const router = express.Router();
const { validateRegister, validateLogin } = require("../Middleware/Validation");
const { Register, Login, logout } = require("../Controller/Auth");

router.post("/register", validateRegister, Register);
router.post("/login", validateLogin, Login);
router.post("/logout", logout);

module.exports = router;
