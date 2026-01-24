const express = require("express");
const router = express.Router();
const EventeventController = require("../controller/EventController");
const eventController = new EventeventController();

router.get("/list", eventController.getEvents);
router.get("/dashboard", eventController.getDashboardData);
router.get("/:id", eventController.getEventById);
router.post("/create", eventController.createEvent);
router.put("/update/:id", eventController.updateEvent);
router.delete("/delete/:id", eventController.deleteEvent);
router.post("/filter", eventController.filterEvents);
router.post("/filter-page", eventController.filterEventsByPagination);

module.exports = router;
