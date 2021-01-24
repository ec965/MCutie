require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const http = require('http');
const WebSocket = require('ws');

const db = require("./models/index"); 
const mqtt = require("./mqtt/index"); 
const logger = require("./config/pino");
const subscribeAll = require('./mqtt/sub');
const routes = require("./route/index");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server: server, path: "/live" });
routes.wss(wss);


db.sequelize.sync({force:false})
.then(subscribeAll(mqtt))
.catch((e) => logger.error("Error setting up the databse:", e));

// middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// routes
// app.use("/live", routes.websocket);
app.use("/mqtt", routes.mqtt);

// since we're using a websocket, listen on the server instead of the app
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

// handle exit
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
      db.sequelize.close();
      mqtt.end();
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));