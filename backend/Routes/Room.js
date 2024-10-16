const express = require("express");
const {
  getAllRooms,
  getSingleRoom,
  updateRoom,
  createRoom,
  deleteRoom,
} = require("../Controller/Room");
const { isAuth, AuthorizedRoles } = require("../Middleware/Protected");
const router = express.Router();

router.get("/get-all-rooms", isAuth, getAllRooms);
router.get("/get-room/:id", isAuth, getSingleRoom);
router.post("/create-room", isAuth, AuthorizedRoles("admin"), createRoom);
router.put("/update-room/:id", isAuth, AuthorizedRoles("admin"), updateRoom);
router.delete("/delete-room/:id", isAuth, AuthorizedRoles("admin"), deleteRoom);
module.exports = router;
