const zod = require("zod");
const MessageConstant = require("../constant/MessageConstant");
const { isValidTime, isValidDate } = require("../utils/DateUtils");
const { eventStatusTypeList, EventStatusType } = require("../enum/EventStatus");

const title = zod
  .string(MessageConstant.EVENT_TITLE_MUST_BE_A_STRING)
  .trim()
  .min(1, MessageConstant.EVENT_TITLE_REQUIRED);

const description = zod
  .string(MessageConstant.EVENT_DESCRIPTION_MUST_BE_A_STRING)
  .trim()
  .min(1, MessageConstant.EVENT_DESCRIPTION_REQUIRED)
  .optional();

const date = zod
  .string(MessageConstant.DATE_IS_REQUIRED)
  .trim()
  .refine((date) => isValidDate(date), MessageConstant.INVALID_DATE_FORMAT)
  .refine((date) => {
    const selectedDate =
      typeof date === "string" ? parseLocalDate(date) : new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, MessageConstant.DATE_CANNOT_BE_IN_THE_PAST);

const time = zod
  .string(MessageConstant.TIME_IS_REQUIRED)
  .trim()
  .refine(
    (time) => isValidTime(time),
    MessageConstant.PLEASE_ENTER_A_VALID_TIME,
  );

const capacity = zod
  .number(MessageConstant.CAPACITY_MUST_BE_A_NUMBER)
  .min(1, MessageConstant.CAPACITY_MUST_BE_POSITIVE);

const price = zod
  .number(MessageConstant.PRICE_MUST_BE_A_NUMBER)
  .min(1, MessageConstant.PRICE_MUST_BE_POSITIVE);

const status = zod.enum(eventStatusTypeList).default(EventStatusType.PENDING);
const active = zod.boolean().default(true);

const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const validateEventDateTime = (date, time) => {
  if (!date || !time) return true;
  const [hours, minutes] = time.split(":").map(Number);
  const eventDateTime =
    typeof date === "string" ? parseLocalDate(date) : new Date(date);
  eventDateTime.setHours(hours, minutes, 0, 0);
  const today = new Date();
  return eventDateTime >= today;
};

const createEvent = zod
  .object({
    title: title,
    description: description,
    date: date,
    time: time,
    capacity: capacity,
    price: price,
    status: status,
    active: active,
  })
  .superRefine((data, ctx) => {
    const { date, time } = data || {};
    if (!validateEventDateTime(date, time)) {
      ctx.addIssue({
        path: ["time"],
        message: MessageConstant.TIME_CANNOT_BE_IN_THE_PAST,
      });
    }
  });

const updateEvent = zod
  .object({
    title: title.optional(),
    description: description.optional(),
    date: date.optional(),
    time: time.optional(),
    capacity: capacity.optional(),
    price: price.optional(),
    status: status.optional(),
    active: active.optional(),
  })
  .superRefine((data, ctx) => {
    const { date, time } = data || {};
    if (!validateEventDateTime(date, time)) {
      ctx.addIssue({
        path: ["time"],
        message: MessageConstant.TIME_CANNOT_BE_IN_THE_PAST,
      });
    }
  });

module.exports = {
  createEvent,
  updateEvent,
};
