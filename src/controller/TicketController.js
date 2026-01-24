const MessageConstant = require("../constant/MessageConstant");
const TicketService = require("../service/TicketService");
const ResponseUtils = require("../utils/ResponseUtils");
const ticketService = new TicketService();
class TicketController {
  async getAllTickets(req, res) {
    try {
      const response = await ticketService.getAllTickets();
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error getting all tickets: ", error);
      return ResponseUtils.internalServerError(res, error?.message || error);
    }
  }

  async getTicketById(req, res) {
    try {
      const response = await ticketService.getTicketById(req?.params?.id);
      if (!response?.success) {
        return ResponseUtils.notFound(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error getting ticket by ID: ", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async createTicket(req, res) {
    try {
      const response = await ticketService.createTicket(req?.body);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.created(res, response?.data);
    } catch (error) {
      console.log("Error creating ticket: ", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async updateTicket(req, res) {
    try {
      const response = await ticketService.updateTicket(
        req?.params?.id,
        req?.body,
      );
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error updating ticket: ", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async deleteTicket(req, res) {
    try {
      const response = await ticketService.deleteTicket(req?.params?.id);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(
        res,
        response?.data,
        MessageConstant.TICKET_DELETED,
      );
    } catch (error) {
      console.log("Error deleting ticket: ", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async filterTickets(req, res) {
    try {
      const response = await ticketService.filterTickets(req?.body);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error filtering tickets: ", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async filterTicketsByPage(req, res) {
    try {
      const response = await ticketService.filterTicketsByPagination(req?.body);
      if (!response?.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error filtering tickets by page: ", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }
}

module.exports = new TicketController();
