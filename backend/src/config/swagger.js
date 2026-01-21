const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ticket Booking API",
      version: "1.0.0",
      description: "API documentation for Ticket Booking application",
    },
  },
  apis: ["./src/api-docs/*.yaml"],
};

const specs = swaggerJsdoc(options);

function swaggerConfig(app, port) {
  app.use("/swagger-ui/index.html", swaggerUi.serve, swaggerUi.setup(specs));
  console.log(
    `Swagger initiated at http://localhost:${port}/swagger-ui/index.html`,
  );
}

module.exports = swaggerConfig;
