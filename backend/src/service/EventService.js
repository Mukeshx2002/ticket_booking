const MessageConstant = require("../constant/MessageConstant");
const EventRepository = require("../repository/EventRepository");
const { validation } = require("../validation");
const { createEvent } = require("../validation/eventValidation");
const eventRepository = new EventRepository();
const TicketRepository = require("../repository/TicketRepository");
const ticketRepository = new TicketRepository();
class EventService {
  async createEvent(data) {
    try {
      const validateData = validation(createEvent, data);
      if (!validateData?.success) {
        return { success: false, data: validateData?.error };
      }
      const event = await eventRepository.create(validateData?.data);
      return { success: true, data: event };
    } catch (error) {
      console.log("Error creating event:", error);
      return { success: false, error: error.message || error };
    }
  }

  async getEventById(id) {
    try {
      const event = await eventRepository.getById(id);
      return { success: true, data: event };
    } catch (error) {
      console.log("Error fetching event:", error);
      return { success: false, error: error.message || error };
    }
  }

  async updateEvent(id, data) {
    try {
      const [raw, event] = await eventRepository.update(id, data);
      if (!event) {
        return { success: false, error: "Event not found" };
      }
      return { success: true, data: event };
    } catch (error) {
      console.log("Error updating event:", error);
      return { success: false, error: error.message || error };
    }
  }

  async deleteEventById(id) {
    try {
      const [raw, event] = await eventRepository.delete(id);
      if (!raw) {
        return { success: false, data: MessageConstant.EVENT_NOT_FOUND };
      }
      return { success: true, data: event };
    } catch (error) {
      console.log("Error deleting event:", error);
      return { success: false, data: error.message || error };
    }
  }

  async getAllEvent() {
    try {
      const events = await eventRepository.getAll();
      return { success: true, data: events };
    } catch (error) {
      console.log("Error fetching events:", error);
      return { success: false, error: error.message || error };
    }
  }

  async filterEvents(data) {
    try {
      const { filter, sort } = data || {};
      const events = await eventRepository.filter(filter, sort);
      return { success: true, data: events };
    } catch (error) {
      console.log("Error filtering events:", error);
      return { success: false, error: error.message || error };
    }
  }

  async filterEventsByPagination(data) {
    try {
      const { filter, sort, page } = data || {};
      const events = await eventRepository.filterByPagination(
        filter,
        sort,
        page,
      );
      return { success: true, data: events };
    } catch (error) {
      console.log("Error filtering events by pagination:", error);
      return { success: false, error: error.message || error };
    }
  }

  async getDashboardData(userId) {
    try {
      const [totalEvents, totalTicketsSold, totalRevenue, events] =
        await Promise.all([
          eventRepository.getTotalEvents(userId),
          ticketRepository.getTotalTicketsSold(userId),
          ticketRepository.getTotalRevenue(userId),
          eventRepository.filter({ userId }),
        ]);
      return {
        success: true,
        data: {
          totalEvents,
          totalTicketsSold,
          totalRevenue,
          events,
        },
      };
    } catch (error) {
      console.log("Error getting dashboard data:", error);
      return { success: false, error: error.message || error };
    }
  }
}

module.exports = EventService;
