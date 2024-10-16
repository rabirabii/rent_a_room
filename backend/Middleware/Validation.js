const { check } = require("express-validator");

// Register
exports.validateRegister = [
  check("name", "Name is Required").not().isEmpty(),
  check("email", "Email is Required").not().isEmpty(),
  check("password", "Password should be at least 6 characters").isLength({
    min: 6,
    max: 24,
  }),
];

// Login
exports.validateLogin = [
  check("email", "Email is Required").isEmail(),
  check("password", "Password is Required").not().isEmpty(),
];
