const express = require("express");
const {
  updateUserInfo,
  getSingleUser,
  getAllCustomer,
  deleteUsers,
} = require("../Controller/User");
const { isAuth, AuthorizedRoles } = require("../Middleware/Protected");

const router = express.Router();

router.put("/update-info", isAuth, AuthorizedRoles("customer"), updateUserInfo);
router.get("/get-info/:id", isAuth, getSingleUser);
router.get(
  "/get-all-customers",
  isAuth,
  AuthorizedRoles("admin"),
  getAllCustomer
);
router.delete("/delete-user", isAuth, AuthorizedRoles("admin"), deleteUsers);
module.exports = router;
