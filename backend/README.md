# Backend Server
The server is an MQTT client. The server listens on subscribed topics and records those messages to an SQLite3 database.

The server also manages a REST API to view logged MQTT messages.

## API Reference
## `GET`
### `/mqtt/t`
Returns mqtt topics.
```json
[
    {
        "id": 2,
        "topic": "esp32-temp/in/dht11/humidity/%RH"
    },
    {
        "id": 1,
        "topic": "esp32-temp/in/dht11/temperature/C"
    }
]
```

### `/mqtt/s`
Returns subscribed topics.
```json
[
    {
        "id": 1,
        "topic": "esp32-temp/out/#",
        "createdAt": "2021-01-20T04:25:49.898Z",
        "updatedAt": "2021-01-20T04:25:49.898Z"
    },
    {
        "id": 2,
        "topic": "esp32-temp/in/#",
        "createdAt": "2021-01-20T04:25:49.929Z",
        "updatedAt": "2021-01-20T04:25:49.929Z"
    }
]
```

### `/mqtt/m?topic=<MQTT TOPIC>`
Returns messages for the given query topic.
For example, to query for `esp32-temp/in/dht11/humidity/%RH`:
```
http://localhost:5000/mqtt/m?topic=esp32-temp/in/dht11/humidity/%RH
```
Returned JSON where time is in unix time:
```json
[
    {
        "id": 2,
        "topic": "esp32-temp/in/dht11/humidity/%RH",
        "createdAt": "2021-01-20T04:25:50.736Z",
        "updatedAt": "2021-01-20T04:25:50.736Z",
        "mqtt_msgs": [
            {
                "id": 2,
                "time": 1611116750,
                "message": "46.00",
                "mqttTopicId": 2
            },
            {
                "id": 4,
                "time": 1611117395,
                "message": "46.00",
                "mqttTopicId": 2
            }
        ]
    }
]
```

## POST
todo:
* send MQTT messages
* subscribe to new topics