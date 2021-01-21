const db = require("./index");

const subs = ["hi", "bye", "hello, there"];
const msgs = [
  {topic: "hi", msg: "world"},
  {topic: 'bye', msg: 'wave'},
  {topic: 'hello', msg: 'moon'}
];

const example = async () => {
  await db.sequelize.sync({force : true});

  for (s of subs){
    await db.Sub.create({topic: s})
  }
  for (m of msgs){
    await db.Msg.create({topic: m.topic, message: m.msg});
  }

  const currSubs = await db.Sub.findAll();
  console.log(JSON.stringify(currSubs, null, 2));

  const currMsgs = await db.Msg.findAll();
  console.log(JSON.stringify(currMsgs, null, 2));
}

example().catch((e) => console.error("Error in example: ", e));