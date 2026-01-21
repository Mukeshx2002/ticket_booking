const express = require("express");
const router = express.Router();
const controller = require("../controller/TicketController");
// const controller = new Controller();

router.get("/list", controller.getAllTickets);
router.get("/:id", controller.getTicketById);
router.post("/create", controller.createTicket);
router.put("/update/:id", controller.updateTicket);
router.delete("/delete/:id", controller.deleteTicket);
router.post("/filter", controller.filterTickets);
router.post("/filter-page", controller.filterTicketsByPage);

module.exports = router;
