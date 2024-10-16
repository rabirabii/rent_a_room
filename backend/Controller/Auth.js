const { validationResult } = require("express-validator");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ErrorHandler = require("../Utils/ErrorHandler");
const { User } = require("../Models/Relations");
const bcrypt = require("bcrypt");
const sendToken = require("../Utils/jwt_token");
const { withTransaction } = require("../Middleware/transaction");

// Registrasi
const Register = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ErrorHandler(errors.array()[0].msg, 400));
  }

  const { name, email, password, role } = req.body;

  const user = await withTransaction(User.sequelize)(async (transaction) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existUser = await User.findOne({ where: { email }, transaction });
    if (existUser) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    return User.create(
      {
        name,
        email,
        password: hashedPassword,
        role,
        avatar: "" || "images/avatars/default.png",
      },
      { transaction }
    );
  });
  res.status(201).json({
    success: true,
    user: user,
  });
});
// Login
const Login = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ErrorHandler(errors.array()[0].msg, 400));
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

module.exports = { Register, Login, logout };
