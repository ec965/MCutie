const pino = require("pino");
const formatters = {
  bindings(bindings) {
    return {};
  },
};
const logger = pino({
  prettyPrint: true,
  level: process.env.LOGLEVEL || "debug",
  formatters,
});
// DB logging is on trace
// MQTT logging is on debug
// anythig important is info and down
module.exports = logger;