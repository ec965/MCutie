const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require('helmet');

const PORT = 3000;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", 'index.html'));
});

app.listen(PORT, "localhost", () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
