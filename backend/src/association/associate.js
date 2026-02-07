const Event = require("../model/Event");
const Ticket = require("../model/Ticket");
const User = require("../model/User");

Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });
Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event" });

Event.hasMany(Ticket, { foreignKey: "eventId", as: "tickets" });
