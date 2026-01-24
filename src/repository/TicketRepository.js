const { Op, Sequelize, SequelizeScopeError } = require("sequelize");
const CommonRepository = require(".");
const Ticket = require("../model/Ticket");
const User = require("../model/User");
const Event = require("../model/Event");
const association = {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "email", "name"],
    },
    {
      model: Event,
      as: "event",
      attributes: ["id", "title", "description", "date", "time"],
    },
  ],
};
const whereClause = (filter) => {
  const {
    id,
    userId,
    eventId,
    seats,
    greaterThanPrice,
    lessThanPrice,
    equalToPrice,
    search,
    softDelete = false,
  } = filter || {};
  const where = {};
  if (id) where.id = id;
  if (userId) where.userId = userId;
  if (eventId) where.eventId = eventId;
  if (seats) where.seats = { [Op.contains]: seats };
  if (greaterThanPrice || lessThanPrice || equalToPrice) {
    where.price = {};
    if (greaterThanPrice) where.price[Op.gt] = greaterThanPrice;
    if (lessThanPrice) where.price[Op.lt] = lessThanPrice;
    if (equalToPrice) where.price[Op.eq] = equalToPrice;
  }
  if (search) {
    where[Op.or] = [
      { "$user.name$": { [Op.like]: `%${search}%` } },
      { "$event.title$": { [Op.like]: `%${search}%` } },
    ];
  }
  where.softDelete =
    softDelete != null || softDelete != undefined ? softDelete : false;
  return where;
};
const attributes = [
  "id",
  "userId",
  "eventId",
  "seats",
  "price",
  "softDelete",
  "createdAt",
  "updatedAt",
];
class TicketRepository extends CommonRepository {
  constructor() {
    super(Ticket, whereClause, association, attributes);
  }
  async getAllTicketsByEventId(eventId) {
    if (!eventId || !Array.isArray(seats)) {
      return [];
    }
    const tickets = await Ticket.findAll({
      attributes: ["seats"],
      where: { eventId, softDelete: false },
    });
    const alreadyBookedSeats = tickets.flatMap((ticket) => ticket?.seats || []);
    return alreadyBookedSeats;
  }
  async findByUserId(userId) {
    return await Ticket.findAll({ where: { userId } });
  }

  async getTotalTicketsSold(userId) {
    const result = await Ticket.findOne({
      attributes: [
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.fn("array_length", Sequelize.col("seats"), 1),
            ),
            0,
          ),
          "totalSeatsSold",
        ],
      ],
      where: { ...(userId && { userId }), softDelete: false },
      raw: true,
      logging: console.log,
    });

    return Number(result.totalSeatsSold);
  }

  async getTotalRevenue(userId) {
    const total = await Ticket.sum("price", {
      where: { ...(userId && { userId }), softDelete: false },
      raw: true,
    });
    return total ?? 0;
  }
}
module.exports = TicketRepository;
