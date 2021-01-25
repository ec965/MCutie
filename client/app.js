require('dotenv').config();
const express = require("express");
const path = require("path");

const IPADDRESS = process.env.IPADDRESS || 'localhost';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", 'index.html'));
});

app.listen(PORT, IPADDRESS, () => {
  console.log(`Listening at http://${IPADDRESS}:${PORT}`);
});
