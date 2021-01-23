import React from 'react';
import {Form, FormItem, FormButton} from '../components/form.js';

const LivePublisher = (props) =>{
  return(
    <Form onSubmit={props.onSubmit}>
      <h3>Publisher</h3>
      <FormItem onChange={props.onChange} name="topic">
        <p>Topic</p>
      </FormItem>
      <FormItem onChange={props.onChange} name="message">
        <p>Message</p>
      </FormItem>
      <FormItem placeholder={0} onChange={props.onChange} name="qos">
        <p>QoS</p>
      </FormItem>
      <FormButton label="Publish"/>
    </Form>
  );
}
export default LivePublisher;