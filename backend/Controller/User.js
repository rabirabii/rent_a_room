const catchAsyncError = require("../Middleware/catchAsyncError");
const { User } = require("../Models/Relations");
const fs = require("fs");
const path = require("path");
const ErrorHandler = require("../Utils/ErrorHandler");
const { Op } = require("sequelize");
const { count } = require("console");

// Update User Info
const updateUserInfo = catchAsyncError(async (req, res, next) => {
  const { name, address, phone } = req.body;
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.name = name;

  user.address = address;
  user.phone = phone;

  if (req.file) {
    const newAvatar = `images/avatars/${req.file.filename}`;

    if (user.avatar && user.avatar !== "images/avatars/default.png") {
      fs.unlink(path.join(__dirname, `../${user.avatar}`), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    user.avatar = newAvatar;
  }

  await user.save();
  res.status(200).json({
    success: true,
    message: "User info updated successfully",
    user,
  });
});

// Get single Customer
const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Get All Users
const getAllCustomer = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const search = req.query.search || "";

  const sortBy = req.query.sortBy || "id";
  const sortOrder = req.query.sortOrder || "ASC";

  let whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        email: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }
  const users = await User.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: [[sortBy, sortOrder]],
  });

  if (!users.rows.length) {
    return next(new ErrorHandler("There are no Users", 404));
  }

  res.status(200).json({
    success: true,
    users: users.rows,
    count: users.count,
    totalPages: Math.ceil(users.count / limit),
    currentPage: page,
  });
});

// Delete User
const deleteUsers = catchAsyncError(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.destroy();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
module.exports = { updateUserInfo, getSingleUser, getAllCustomer, deleteUsers };
