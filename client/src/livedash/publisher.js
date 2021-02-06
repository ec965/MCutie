import React, {useState} from 'react';
import {Form, FormItem, FormButton} from '../components/form.js';

const LivePublisher = (props) =>{
  const [topic, setTopic] = useState('');
  const [msg, setMsg] = useState('');
  const [qos, setQos] = useState(0);

  const handlePublish = (e) =>{
    e.preventDefault();
    var txData = (JSON.stringify({
      request: 'publish',
      payload:{
        topic: topic,
        message: msg,
        qos: qos
      }
    }))
    props.ws.send(txData);
  }

  return(
    <Form onSubmit={handlePublish}>
      <h3>Publish</h3>
      <FormItem type='text' value={topic} onChange={(e) => setTopic(e.target.value)} name="topic">
        Topic
      </FormItem>
      <FormItem type='text' value={msg} onChange={(e) => setMsg(e.target.value)} name="message">
        Message
      </FormItem>
      <FormItem type='text' value={qos} placeholder={0} onChange={(e) => setQos(e.target.value)} name="qos">
        QoS
      </FormItem>
      <FormButton label="Publish"/>
    </Form>
  );
}
export default LivePublisher;