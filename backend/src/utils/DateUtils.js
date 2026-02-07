const moment = require("moment");

const TIME_FORMAT = "HH:mm";
const DATE_FORMAT = "YYYY-MM-DD";

const isValidDate = (date) => {
  if (!date) return false;
  return moment(date, DATE_FORMAT, true).isValid();
};

const isValidTime = (time) => {
  if (!time) return false;
  return moment(time, TIME_FORMAT, true).isValid();
};

module.exports = {
  isValidDate,
  isValidTime,
};
