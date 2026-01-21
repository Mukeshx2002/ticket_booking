const { Op, Sequelize } = require("sequelize");
const CommonRepository = require(".");
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");

const whereClause = (filter) => {
  const {
    id,
    startDate,
    endDate,
    startTime,
    endTime,
    lessThanCapicity,
    greaterThanCapicity,
    equalToCapicity,
    lessThanBooked,
    greaterThanBooked,
    equalToBooked,
    lessThanPrice,
    greaterThanPrice,
    equalToPrice,
    status,
    active,
    search,
    userId,
    softDelete = false,
  } = filter || {};
  const where = {};
  if (id) where.id = id;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }
  if (startTime || endTime) {
    where.time = {};
    if (startTime) where.time[Op.gte] = startTime;
    if (endTime) where.time[Op.lte] = endTime;
  }
  if (lessThanCapicity || greaterThanCapicity || equalToCapicity) {
    where.capacity = {};
    if (lessThanCapicity) where.capacity[Op.lt] = lessThanCapicity;
    if (greaterThanCapicity) where.capacity[Op.gt] = greaterThanCapicity;
    if (equalToCapicity) where.capacity[Op.eq] = equalToCapicity;
  }

  if (lessThanBooked || greaterThanBooked || equalToBooked) {
    where.booked = {};
    if (lessThanBooked) where.booked[Op.lt] = lessThanBooked;
    if (greaterThanBooked) where.booked[Op.gt] = greaterThanBooked;
    if (equalToBooked) where.booked[Op.eq] = equalToBooked;
  }

  if (lessThanPrice || greaterThanPrice || equalToPrice) {
    where.price = {};
    if (lessThanPrice) where.price[Op.lt] = lessThanPrice;
    if (greaterThanPrice) where.price[Op.gt] = greaterThanPrice;
    if (equalToPrice) where.price[Op.eq] = equalToPrice;
  }
  if (status) where.status = status;
  if (active) where.active = active;
  if (userId)
    where[Op.and] = Sequelize.literal(`
      EXISTS (
        SELECT 1
        FROM "tickets" t
        WHERE t."eventId" = "event"."id"
        AND t."userId" = ${userId}
        AND t."softDelete" = false
      )
    `);
  where.softDelete =
    softDelete != null || softDelete != undefined ? softDelete : false;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }
  return where;
};

const association = {};

const attributes = {
  include: [
    [
      Sequelize.literal(`
                (
                SELECT COALESCE(JSON_AGG(seat), '[]')
                    FROM tickets t
                    CROSS JOIN UNNEST(t."seats") AS seat
                    WHERE t."eventId" = event.id
                    AND t."softDelete" = false
                )
            `),
      "allSeats",
    ],
    [
      Sequelize.literal(`
                (
                    SELECT COALESCE(SUM(array_length(t."seats", 1)), 0)
                    FROM tickets t
                    WHERE t."eventId" = event.id
                    AND t."softDelete" = false
                )
      `),
      "bookingCount",
    ],
    [
      Sequelize.literal(`
                (
                    SELECT COALESCE(SUM(array_length(t."seats", 1)), 0)
                    FROM tickets t
                    WHERE t."eventId" = event.id
                    AND t."softDelete" = true
                )
            `),
      "cancelledCount",
    ],
    [
      Sequelize.literal(`
                (
                    SELECT COALESCE(SUM(t."price"), 0)
                    FROM tickets t
                    WHERE t."eventId" = event.id
                    AND t."softDelete" = false
                )
            `),
      "bookingRevenue",
    ],
  ],
};
class EventRepository extends CommonRepository {
  constructor() {
    super(Event, whereClause, association, attributes);
  }

  async getTotalEvents(userId) {
    return await Event.count({
      where: {
        softDelete: false,
        ...(userId && {
          [Op.and]: Sequelize.literal(`
              EXISTS (
                SELECT 1
                FROM "tickets" t
                WHERE t."eventId" = "event"."id"
                AND t."userId" = ${userId}
                AND t."softDelete" = false
              )
            `),
        }),
      },
    });
  }
}
module.exports = EventRepository;
