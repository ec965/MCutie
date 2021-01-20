const db = require("./index");

const example = async () => {
  const m1 = {t: "hi", m: 'world'};
  const m2 = {t: "bye", m: 'world'};
  const m3 = {t: "hi", m: 'earth'};
  const m4 = {t: "bye", m: 'earth'};
  const m5 = {t: "american pi", m: 'mymy'};
  const msgs = [m1, m2, m3, m4, m5];

  const subs = ["hi", "bye", "etc/#"];

  await db.client.sync({force: true});

  for (s of subs) {
    await db.mqtt_sub.subscribe_topic(s);
  }

  console.log(JSON.stringify(await db.mqtt_sub.list_subscriptions(), null, 2));
  await db.mqtt_sub.unsubscribe_topic(subs[0]);
  console.log(JSON.stringify(await db.mqtt_sub.list_subscriptions(), null, 2));

  for (m of msgs) {
    await db.mqtt_msg.add_new_msg(m.t, m.m);
  }

  console.log(JSON.stringify(await db.mqtt_msg.list_topics(), null, 2));
  console.log(JSON.stringify(await db.mqtt_msg.list_messages(m1.t), null, 2));
  console.log(JSON.stringify(await db.mqtt_msg.get_last_message(m1.t), null, 2));

}

example().catch((e) => console.error("Error in example: ", e));