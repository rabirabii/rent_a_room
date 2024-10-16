const { DataTypes } = require("sequelize");
const DatabaseConnection = require("../DatabaseConnections");

const Booking = DatabaseConnection.define("Bookings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Rooms",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  checkIn: {
    type: DataTypes.DATE,
  },
  checkOut: {
    type: DataTypes.DATE,
  },
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = Booking;
