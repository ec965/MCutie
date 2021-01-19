const sqlite3 = require("sqlite3").verbose(); // sqlite3 client
const client = new sqlite3.Database("mqtt.db");

// create the table that mqtt data will go in
const create_table = () => {
  client.serialize(() => {
    client.run(
      `CREATE TABLE IF NOT EXISTS mqtt_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT (strftime('%s', 'now')),
                topic TEXT NOT NULL,
                payload TEXT NOT NULL
            );`
    );
  });
};

// insert mqtt messages into the client
const insert_mqtt = (topic, payload) => {
  var stmt = client.prepare(
    `INSERT INTO mqtt_log (topic, payload)
        VALUES (?, ?);`
  );
  stmt.run(topic, payload);
  stmt.finalize();
};

// select a topic and return all it's rows to the callback function
const select_all = (topic, callback) => {
  var stmt = client.prepare(
    `SELECT timestamp, payload FROM mqtt_log WHERE topic LIKE ?;`
  );
  stmt.all(topic, (err, rows) => {
    callback(err, rows);
  });
};

// select the last row's payload in a topic query
// `row` will be in the format:
// row = {payload: _ };
const select_last = (topic, callback) => {
  var stmt = client.prepare(
    "SELECT payload FROM mqtt_log WHERE topic LIKE ? ORDER BY id DESC LIMIT 1;"
  );
  stmt.get(topic, (err, row) => {
    callback(err, row);
  });
};

// select a list of distinct topics
const select_topics = (callback) => {
  client.all("SELECT DISTINCT topic FROM mqtt_log", (err, rows) => {
    callback(err, rows);
  });
};

module.exports = {
  create_table,
  insert_mqtt,
  select_all,
  select_last,
  select_topics,
  client,
};
