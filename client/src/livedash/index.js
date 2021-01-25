import React, { useEffect, useState, useRef } from 'react';
import TableOfSubs from "./subs";
import {Row, Column} from "../components/layout.js";
import Page from '../components/page.js';
import {WEBSOCKET} from '../util';
import LiveTopics from './table.js';
import LivePublisher from './publisher.js';

class LiveDash extends React.Component {

  constructor() {
    super();
    this.state = {};
  }
  ws = new WebSocket(WEBSOCKET);

  componentDidMount(){
    this.ws.onopen = () => {
      console.log("websocket connected");
    }
    this.ws.onclose = () => {
      console.log("websocket closed");
    }
  }

  componentWillUnmount(){
    this.ws.close();
  }

  render(){
    return(
      <Page>
        <Column>
          <Row>
            <LiveTopics ws={this.ws}/>
          </Row>
          <Row className="top space">
            <Row>
              <LivePublisher ws={this.ws}/>
            </Row>
            <Column className="top">
              <TableOfSubs/>
            </Column>
          </Row>
        </Column>
      </Page>
    );
  }

}

export default LiveDash;