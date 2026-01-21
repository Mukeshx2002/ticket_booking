const EventStatusType = {
  LAUNCHED: "LAUNCHED",
  CANCELLED: "CANCELLED",
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
};

const eventStatusTypeList = Object.keys(EventStatusType);
module.exports = { EventStatusType, eventStatusTypeList };
