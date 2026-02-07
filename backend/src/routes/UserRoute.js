const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const userController = new UserController();

router.post("/add", userController.addUser);
router.get("/list", userController.listUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/filter", userController.getFilterUser);
router.post("/filter-page", userController.getFilterUserByPage);

//Auth module
router.post("/login", userController.login);
module.exports = router;
