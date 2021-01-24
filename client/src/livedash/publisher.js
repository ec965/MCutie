import React from 'react';
import {Form, FormItem, FormButton} from '../components/form.js';

const LivePublisher = (props) =>{
  return(
    <Form onSubmit={props.onSubmit}>
      <h3>Publish</h3>
      <FormItem type='text' onChange={props.onChange} name="topic">
        Topic
      </FormItem>
      <FormItem type='text' onChange={props.onChange} name="message">
        Message
      </FormItem>
      <FormItem type='text' placeholder={0} onChange={props.onChange} name="qos">
        QoS
      </FormItem>
      <FormButton label="Publish"/>
    </Form>
  );
}
export default LivePublisher;