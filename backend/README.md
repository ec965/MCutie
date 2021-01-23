# Backend Server
The server is an MQTT client. The server listens on subscribed topics and records those messages to an SQLite3 database.

The server also manages a REST API to view logged MQTT msgs and can update subscriptions.

## API Reference
## `GET`
### `/mqtt/t`
Returns mqtt topics.
* 200: Ok
* 500: Error getting data from database.
```json
[
    {
        "topic": "hi"
    }
]
```

### `/mqtt/s`
Returns subscribed topics.
* 200: Ok
* 500: Error getting data from database.
```json
[
    {
        "id": 2,
        "topic": "hi",
        "qos": 0,
        "createdAt": "2021-01-21T11:03:45.677Z"
    },
    {
        "id": 3,
        "topic": "hi2",
        "qos": 0,
        "createdAt": "2021-01-21T11:03:48.352Z"
    }
]
```

### `/mqtt/m?topic=<MQTT TOPIC>`
Returns messages for the given query topic.
For example, to query for `hi`, use the url ```http://localhost:5000/mqtt/m?topic=hi```.
* 200: Ok
* 500: Error getting data from database.

```json
[
    {
        "id": 1,
        "message": "hi",
        "topic": "hi",
        "createdAt": "2021-01-21T10:57:56.379Z"
    },
    {
        "id": 2,
        "message": "hi",
        "topic": "hi",
        "createdAt": "2021-01-21T10:57:57.266Z"
    },
    {
        "id": 3,
        "message": "hi",
        "topic": "hi",
        "createdAt": "2021-01-21T10:57:58.214Z"
    },
    {
        "id": 4,
        "message": "hi",
        "topic": "hi",
        "createdAt": "2021-01-21T11:03:50.375Z"
    }
]
```

## POST

### `/mqtt/s`
Subscribe to a new topic.
* 400: bad payload
* 400: subscription already exists
* 502: mqtt client failed to subscribe
* 500: failed to add data to database
Request body should be in the format
```json
{
    "topic" : "<TOPIC>",
    "qos" : "<QOS>"
}
```

## DELETE

### `/mqtt/s`
Unsubscribe from a topic.
* 400: bad payload
* 502: mqtt client failed to unsubscribe
* 404: item to delete doesn't exist
* 500: error deleting item from database
Request body should be int he format:
```json
{
    "topic" : "<TOPIC>"
}
```


## Web Socket Reference

### `/live/`
Get live messages or publish messages.

#### Publish
Publish message JSON structure:
```json
{
  "request":"publish", 
  "topic":"<TOPIC>", 
  "message":"<MESSAGE>", 
  "qos": "<QOS>"
}
```

#### Live topic
New data is sent every second.

Start live topic JSON structure:
```json
{
  "request":"live",
  "topic": "<TOPIC>"
}
```