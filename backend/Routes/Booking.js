const express = require("express");
const router = express.Router();
const { createBooking } = require("../Controller/Booking");
const { isAuth, AuthorizedRoles } = require("../Middleware/Protected");

router.post("/create-booking", isAuth, createBooking);

module.exports = router;
