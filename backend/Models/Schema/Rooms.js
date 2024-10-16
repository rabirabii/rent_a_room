const { DataTypes } = require("sequelize");
const DatabaseConnection = require("../DatabaseConnections");

const Room = DatabaseConnection.define("Rooms", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  facility: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("available", "booked"),
    defaultValue: "available",
    allowNull: false,
  },
});

module.exports = Room;
