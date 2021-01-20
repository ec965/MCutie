const pino = require("pino");
const formatters = {
  bindings(bindings) {
    return {};
  },
};
const logger = pino({
  prettyPrint: true,
  level: "debug",
  formatters,
});

module.exports = logger;