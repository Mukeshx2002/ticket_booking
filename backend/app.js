const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // import cors
require("dotenv").config();
require("./src/model/Index");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors()); // cors handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const routes = require("./src/routes/Index");
const swaggerConfig = require("./src/config/swagger");
app.use(routes);
app.post("/", (req, res) => {
  console.log("body: ", req.body);
  res.send(req.body);
});

swaggerConfig(app, PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
