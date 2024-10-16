const { Op } = require("sequelize");
const catchAsyncError = require("../Middleware/catchAsyncError");
const { withTransaction } = require("../Middleware/transaction");
const { Booking, Room } = require("../Models/Relations");
const ErrorHandler = require("../Utils/ErrorHandler");

const createBooking = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { roomId, checkIn, checkOut } = req.body;
  if (!user || !roomId || !checkIn || !checkOut) {
    return next(
      new ErrorHandler("Please provide all the required fields", 400)
    );
  }

  console.log("Transaction input:", {
    roomId,
    userId: user.id,
    checkIn,
    checkOut,
  });

  try {
    const room = await Room.findByPk(roomId);
    if (!room) {
      return next(new ErrorHandler("Invalid room ID", 400));
    }

    const booking = await withTransaction(Booking.sequelize)(
      async (transaction) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkInDate >= checkOutDate) {
          throw new ErrorHandler(
            "Check-out date must be after check-in date",
            400
          );
        }

        const existingBooking = await Booking.findOne({
          where: {
            roomId,
            [Op.or]: [
              {
                checkIn: { [Op.lt]: checkOutDate },
                checkOut: { [Op.gt]: checkInDate },
              },
              {
                checkIn: {
                  [Op.between]: [checkInDate, checkOutDate],
                },
              },
              {
                checkOut: {
                  [Op.between]: [checkInDate, checkOutDate],
                },
              },
            ],
          },
          transaction,
        });

        if (existingBooking) {
          throw new ErrorHandler(
            "Room is already booked for the specified dates",
            409
          );
        }

        return Booking.create(
          {
            userId: user.id,
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            status: "pending",
            bookingDate: new Date(),
          },
          { transaction }
        );
      }
    );

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    if (error instanceof ErrorHandler) {
      return next(error);
    }
    return next(new ErrorHandler("Failed to create booking", 500));
  }
});

const getBookings = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.findAll();

  const ownedBookings = bookings.filter(
    (booking) => booking.userId === req.user.id
  );

  res.status(200).json({ success: true, data: ownedBookings });
});

module.exports = { createBooking, getBookings };
