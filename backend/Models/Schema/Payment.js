const { DataTypes } = require("sequelize");
const DatabaseConnection = require("../DatabaseConnections");

const Payment = DatabaseConnection.define("Payments", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  bookingId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Bookings",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM("pending", "success", "failed"),
    defaultValue: "pending",
    allowNull: false,
  },
});

module.exports = Payment;
