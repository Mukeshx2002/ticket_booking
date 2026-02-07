const db = require("../config/dbConfig");

require("../association/associate");

const User = require("../model/User");
const Event = require("../model/Event");
const Ticket = require("../model/Ticket");

// User.hasMany(Event, { foreignKey: "userId", as: "events" });
// User.hasMany(Ticket, { foreignKey: "userId", as: "tickets" });

// Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });

// Event.hasMany(Ticket, { foreignKey: "eventId", as: "tickets" });
// Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event" });

db.sync({ alter: true })
  .then(() => {
    console.log("Database connection successfully");
  })
  .catch((error) => {
    console.log("Database connection error...");
    console.log("error: ", error);
  });

module.exports = {
  db,
  User,
  Event,
  Ticket,
};
