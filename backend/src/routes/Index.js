const express = require("express");
const router = express.Router();
const userRoute = require("./UserRoute");
const ticketRoute = require("./TicketRoute");
const eventRoute = require("./EventRoute");

router.use("/user", userRoute);
router.use("/ticket", ticketRoute);
router.use("/event", eventRoute);

module.exports = router;
