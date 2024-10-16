const User = require("./Schema/Users");
const Room = require("./Schema/Rooms");
const Booking = require("./Schema/Bookings");
const Payment = require("./Schema/Payment");

// Definisikan relasi-relasi
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Room.hasMany(Booking, { foreignKey: "roomId", as: "rooms" });
Booking.belongsTo(User, { foreignKey: "userId", as: "users" });
Booking.belongsTo(Room, { foreignKey: "roomId", as: "rooms" });
Booking.hasMany(Payment, { foreignKey: "bookingId", as: "payments" });
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });

// Pastikan kamu mengekspor model
module.exports = { User, Room, Booking, Payment };
