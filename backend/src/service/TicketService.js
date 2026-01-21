const MessageConstant = require("../constant/MessageConstant");
const TicketRepository = require("../repository/TicketRepository");
const { validation } = require("../validation");
const {
  createTicket,
  updateTicket,
} = require("../validation/ticketValidation");
const ticketRepository = new TicketRepository();
const EventService = require("../service/EventService");
const eventService = new EventService();
class TicketService {
  async getAllTickets() {
    const tickets = await ticketRepository.getAll();
    return { success: true, data: tickets };
  }

  async getTicketById(id) {
    const ticket = await ticketRepository.getById(id);
    return { success: true, data: ticket };
  }

  async createTicket(data) {
    const validateData = validation(createTicket, data);
    if (!validateData?.success) {
      return { success: false, data: validateData.error };
    }
    const { eventId, seats } = validateData?.data;
    const eventData = await eventService.getEventById(eventId);
    const event = eventData?.data;
    if (!event) {
      return { success: false, data: MessageConstant.EVENT_NOT_FOUND };
    }
    const allBookedSeats =
      await ticketRepository.getAllTicketsByEventId(eventId);
    if (allBookedSeats && allBookedSeats?.length > 0) {
      const alreadyBookedSeats = seats.filter((seat) =>
        allBookedSeats?.includes(seat),
      );
      if (alreadyBookedSeats && alreadyBookedSeats?.length > 0) {
        return {
          success: false,
          data: MessageConstant.SEAT_ALREADY_BOOKED(
            alreadyBookedSeats,
            event?.title,
          ),
        };
      }
    }
    const insertData = {
      ...validateData?.data,
      price: (event?.price || 0) * (seats?.length || 0),
    };
    const ticket = await ticketRepository.create(insertData);
    return { success: true, data: ticket };
  }

  async updateTicket(id, data) {
    const validateData = validation(updateTicket, data);
    if (!validateData.success) {
      return { success: false, data: validateData.error };
    }
    const [raw, ticket] = await ticketRepository.update(id, validateData?.data);
    if (!raw) {
      return { success: false, data: MessageConstant.TICKET_NOT_FOUND };
    }
    return { success: true, data: ticket };
  }

  async deleteTicket(id) {
    const [raw, ticket] = await ticketRepository.delete(id);
    if (!raw) {
      return { success: false, data: MessageConstant.TICKET_NOT_FOUND };
    }
    return { success: true, data: ticket };
  }

  async filterTickets(data) {
    const { filter, sort } = data || {};
    const tickets = await ticketRepository.filter(filter, sort);
    // const tickets = await ticketRepository.getTotalSeats(filter);
    return { success: true, data: tickets };
  }

  async filterTicketsByPagination(data) {
    const { filter, sort, page } = data || {};
    const tickets = await ticketRepository.filterByPagination(
      filter,
      sort,
      page,
    );
    return { success: true, data: tickets };
  }
}

module.exports = TicketService;
