# MQTT Server API and Client
MCutie provides a web client and API to log and chart MQTT sensor data.
MCutie should run concurrently with an MQTT broker such as mosquitto.

## [Backend](./backend/README.md)
* Express.js
* SQLite3

## [Frontend](./client/README.md)
* React.js

## Deploying on a Raspberry Pi
1. Allow the port for the client: `sudo ufw allow 80`.
2. Allow the port for the server: `sudo ufw allow 5000`.
3. Set up the MQTT broker `sudo apt install mosquitto`.
    * You should [enable passwords and users](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-the-mosquitto-mqtt-messaging-broker-on-ubuntu-16-04).
4. Change `./backend/.env` to reflect the credentials of the broker.
5. Change `./client/src/util.js` to reflect credentials of the Raspberry Pi.
6. Rebuild the client: `cd client` then `npm run build`.
7. Launch the App from the root directory with `npm run prod`.
8. You should be able to see the App running on the local network from the IP address of your Raspberry Pi.
