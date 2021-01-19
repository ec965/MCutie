const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const sequelize = new Sequelize('sqlite:test.db');

const test_connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to db");
    } catch (error) {
        console.error('Not connceted to db with error:', error);
    }
}

class MqttLog extends Model {};
MqttLog.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    time: { type:'TIMESTAMP', defaultValue: Sequelize.literal("(strftime('%s', 'now'))") },
    topic: { type:DataTypes.TEXT, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false }
}, {
    sequelize,
    modelName: 'MqttLog'
});


const main = async () => {
    // create the table
    await MqttLog.sync(); // this is an async function

    // create a new row
    await MqttLog.create({topic:"hello", message: "world"});
    await MqttLog.create({topic:"hello", message: "earth"});
    await MqttLog.create({topic:"bye", message: "earth"});

    // select a topic and return timestamp and message
    const topic = 'hello';
    const rows = await MqttLog.findAll({
        attributes: ['time', 'message'],
        where: { topic : {[Op.like]: topic} }
    });
    console.log(JSON.stringify(rows, null, 2));

    // select all unique topics
    const topics = await select_topics();
    console.log(topics);

    // select last message for a topic
    const last = await MqttLog.findAll({
        attributes:['id','message'],
        limit: 1,
        where: { topic : {[Op.like]: topic}},
        order: sequelize.literal('id DESC')
    })
    console.log(JSON.stringify(last, null, 2));
}

main().catch((error) => console.error(error));

const select_topics = async () => {
    var query = await sequelize.query("SELECT DISTINCT topic FROM MqttLogs");
    var topics = [];
    for (q of query[0]){
        topics.push(q.topic);
    }
    return topics;
}

module.exports = {MqttLog, select_topics};