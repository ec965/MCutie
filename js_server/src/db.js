// create the table that mqtt data will go in
const create_table = (db) => {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS mqtt_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp INTEGER,
                topic TEXT NOT NULL,
                payload TEXT NOT NULL
            );`
        );
        
    });
}

// insert mqtt messages into the db
const insert_mqtt = (db, timestamp, topic, payload) => {
    var stmt = db.prepare(
        `INSERT INTO mqtt_log (timestamp, topic, payload)
        VALUES (?, ?, ?);`
    );
    stmt.run(timestamp, topic, payload);
    stmt.finalize();
}

// select a topic and return all it's rows to the callback function
const select_all = (db, topic, callback) => {
    var stmt = db.prepare(
        `SELECT timestamp, payload FROM mqtt_log WHERE topic LIKE ?;`
    );
    stmt.all(
        topic,
        (err, rows) => {
            callback(err, rows);
        },
    );
}

// select the last row's payload in a topic query
// `row` will be in the format:
// row = {payload: _ };
const select_last = (db, topic, callback) => {
    var stmt = db.prepare(
        "SELECT payload FROM mqtt_log WHERE topic LIKE ? ORDER BY id DESC LIMIT 1;"
    );
    stmt.get(
        topic,
        (err, row) => {
            callback(err, row);
        }
    );
}

// select a list of distinct topics
const select_topics = (db, callback) => {
    db.all("SELECT DISTINCT topic FROM mqtt_log",
        (err, rows) => {
            callback(err, rows);
        }
    );
}




module.exports = {create_table, insert_mqtt, select_all, select_last, select_topics};