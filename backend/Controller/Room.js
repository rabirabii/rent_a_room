const { Op, fn, col } = require("sequelize");
const catchAsyncError = require("../Middleware/catchAsyncError");
const { Room } = require("../Models/Relations");
const ErrorHandler = require("../Utils/ErrorHandler");
const { withTransaction } = require("../Middleware/transaction");

const getAllRooms = catchAsyncError(async (req, res, next) => {
  const {
    price_min,
    price_max,
    status,
    sort_by = "createdAt",
    sort_order = "DESC",
    search,
    page = 1,
    limit = 10,
    facility,
    facility_search,
  } = req.query;

  const filter = {};
  if (price_min && price_max) {
    filter.proce = {
      [Op.between]: [parseFloat(price_min), parseFloat(price_max)],
    };
  } else if (price_min) {
    filter.price = {
      [Op.gte]: parseFloat(price_min),
    };
  } else if (price_max) {
    filter.price = {
      [Op.lte]: parseFloat(price_max),
    };
  }

  if (status) {
    filter.status = status;
  }

  if (facility) {
    filter.facility = {
      [Op.contains]: [facility],
    };
  }

  if (search) {
    filter[Op.or] = [
      {
        roomNumber: {
          [Op.iLike]: `%${search}%`,
        },

        description: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  if (facility_search) {
    filter.facility = {
      [Op.contains]: [facility_search],
    };
  }

  const offset = (page - 1) * limit;

  let order;
  if (sort_by === "facility") {
    order = [fn("array_length", col("facility"), 1), sort_order];
  } else {
    order = [[sort_by, sort_order]];
  }

  const { count, rows: rooms } = await Room.findAndCountAll({
    where: filter,
    limit: parseInt(limit),
    offset: offset,
    order: order,
  });

  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    success: true,
    data: rooms,
    currentPage: parseInt(page),
    totalPages,
    totalItems: count,
  });
});

// Get a Room
const getSingleRoom = catchAsyncError(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }
  res.status(200).json({ success: true, data: room });
});

// Create a Room
const createRoom = catchAsyncError(async (req, res, next) => {
  const { roomNumber, description, price, facility } = req.body;

  if (!roomNumber || !description || !price || !facility) {
    return next(
      new ErrorHandler("Please provide all the required fields", 400)
    );
  }

  const room = await withTransaction(Room.sequelize)(async (transaction) => {
    const roomExists = await Room.findOne({
      where: { roomNumber },
      transaction,
    });
    if (roomExists) {
      return next(new ErrorHandler("Room already exists", 400));
    }

    return Room.create(
      { roomNumber, description, price, facility },
      { transaction }
    );
  });

  res.status(201).json({
    success: true,
    data: room,
  });
});
// Update a Room
const updateRoom = catchAsyncError(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  const { roomNumber, description, price, facility } = req.body;

  if (!roomNumber || !description || !price || !facility) {
    return next(
      new ErrorHandler("Please provide all the required fields", 400)
    );
  }

  const roomExists = await Room.findOne({ where: { roomNumber } });
  if (roomExists) {
    return next(new ErrorHandler("Room already exists", 400));
  }

  room.roomNumber = roomNumber;
  room.description = description;
  room.price = price;
  room.facility = facility;

  await room.save();

  res.status(200).json({
    success: true,
    data: room,
  });
});

// Delete a Room
const deleteRoom = catchAsyncError(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  await room.destroy();

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});
module.exports = {
  getAllRooms,
  getSingleRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
