const zod = require("zod");
const MessageConstant = require("../constant/MessageConstant");
const userId = zod
  .number(MessageConstant.USER_ID_MUST_BE_A_NUMBER)
  .min(1, MessageConstant.USER_ID_MUST_BE_POSITIVE);
const eventId = zod
  .number(MessageConstant.EVENT_ID_MUST_BE_A_NUMBER)
  .min(1, MessageConstant.EVENT_ID_MUST_BE_POSITIVE);
const seats = zod
  .array(
    zod
      .string(MessageConstant.SEAT_MUST_BE_A_STRING)
      .trim()
      .min(1, MessageConstant.SEAT_CAN_NOT_BE_EMPTY),
    MessageConstant.SEAT_MUST_BE_AN_ARRAY,
  )
  .min(1, MessageConstant.AT_LEAST_ONE_SEAT_MUST_BE_SELECTED);
const price = zod
  .number(MessageConstant.PRICE_MUST_BE_A_NUMBER)
  .min(1, MessageConstant.PRICE_MUST_BE_POSITIVE)
  .optional();

const createTicket = zod.object({
  userId: userId,
  eventId: eventId,
  seats: seats,
  price: price,
});

const updateTicket = zod.object({
  userId: userId.optional(),
  eventId: eventId.optional(),
  seats: seats.optional(),
  price: price,
});

module.exports = {
  createTicket,
  updateTicket,
};
