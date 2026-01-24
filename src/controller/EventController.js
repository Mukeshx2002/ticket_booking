const MessageConstant = require("../constant/MessageConstant");
const EventService = require("../service/EventService");
const ResponseUtils = require("../utils/ResponseUtils");
const eventService = new EventService();
class EventController {
  async createEvent(req, res) {
    try {
      const response = await eventService.createEvent(req?.body);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.created(
        res,
        response?.data,
        MessageConstant.EVENT_CREATED,
      );
    } catch (error) {
      console.log("Error creating event:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async getEvents(req, res) {
    try {
      const response = await eventService.getAllEvent();
      return ResponseUtils.getOkResponse(
        res,
        response?.data,
        MessageConstant.EVENTS_FETCHED,
      );
    } catch (error) {
      console.log("Error getting events:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async getEventById(req, res) {
    try {
      const response = await eventService.getEventById(req.params.id);
      if (!response.success) {
        return ResponseUtils.notFound(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response.data);
    } catch (error) {
      console.log("Error getting event by ID:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async updateEvent(req, res) {
    try {
      const response = await eventService.updateEvent(
        req?.params?.id,
        req?.body,
      );
      if (!response?.success) {
        return ResponseUtils.notFound(res, response?.data);
      }
      return ResponseUtils.updated(
        res,
        response?.data,
        MessageConstant.EVENT_UPDATED,
      );
    } catch (error) {
      console.log("Error updating event:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async deleteEvent(req, res) {
    try {
      const response = await eventService.deleteEventById(req?.params?.id);
      if (!response?.success) {
        return ResponseUtils.notFound(res, response?.data);
      }
      return ResponseUtils.deleted(
        res,
        response?.data,
        MessageConstant.EVENT_DELETED,
      );
    } catch (error) {
      console.log("Error deleting event:", error);
      return ResponseUtils.serverError(res, error?.message);
    }
  }
  async filterEvents(req, res) {
    try {
      const response = await eventService.filterEvents(req?.body);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error filtering events:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async filterEventsByPagination(req, res) {
    try {
      const response = await eventService.filterEventsByPagination(req?.body);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error filtering events by pagination:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async getDashboardData(req, res) {
    try {
      const response = await eventService.getDashboardData(req?.query?.userId);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error getting dashboard data:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }
}

module.exports = EventController;
