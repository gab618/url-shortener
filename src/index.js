const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/:id", (req, res) => {
  // TODO: redirect to url
});

app.post("/url", (req, res) => {
  // TODO: create url
});

app.get("/url/:id", (req, res) => {
  // TODO: get a shor url by id
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
