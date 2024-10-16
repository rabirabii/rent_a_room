const jwt = require("jsonwebtoken");

const { DataTypes } = require("sequelize");
const DatabaseConnection = require("../DatabaseConnections");

const User = DatabaseConnection.define("Users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("admin", "customer"),
    defaultValue: "customer",
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "images/avatars/default.png",
  },
  address: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.prototype.getJwtToken = function () {
  return jwt.sign(
    {
      id: this.id,
      role: this.role,
      email: this.email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

module.exports = User;
