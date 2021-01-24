import React, { useEffect, useState, useRef } from 'react';
import TableOfSubs from "./subs";
import {Row, Column} from "../components/layout.js";
import Page from '../components/page.js';
import {WEBSOCKET} from '../util';
import LiveTopics from './table.js';
import LivePublisher from './publisher.js';
import LiveChart from './chart.js';


const LiveDash = (props) => {
  const ws = useRef(null);

  // data coming in on the web socket
  const [rxData, setRxData] = useState([]);
  // current live topic to display on the chart
  const [liveTopic, setLiveTopic] = useState("");
  // new topics
  const [newTopics, setNewTopics] = useState([]);

  // states for live publisher form
  const [pubTopic, setPubTopic] = useState("");
  const [pubMsg, setPubMsg] = useState("");
  const [pubQos, setPubQos] = useState(0);

  // websocket stuff
  useEffect(()=>{
    ws.current = new WebSocket(WEBSOCKET);
    ws.current.onopen = () => {
      console.log("websocket connected");
    }
    ws.current.onclose = () => {
      console.log("websocket closed");
    }
    
    ws.current.onmessage = (event) => {
      let data = JSON.parse(event.data);
      // check the reponse to see what we need to parse for
      if (data.response === "data"){
        for(let i=0; i<data.data.length; i++){
          // parse date into unix time for chart
          data.data[i]["createdAt"] = Date.parse(data.data[i]["createdAt"]);
        }
        setRxData(data.data);
      } 
      else if (data.response === "new topics"){
        setNewTopics(data.data);
      }
    }

    return () => {
      ws.current.close();
    };

  }, []); 

  // handle submit on live publisher
  const handlePublish = (event) => {
    event.preventDefault();
    if (!ws.current) return;

    if (ws.current.readyState === ws.current.OPEN){
      var txData = (JSON.stringify(
        {
          request: "publish",
          topic: pubTopic,
          message: pubMsg,
          qos: pubQos,
        }
      ));
      ws.current.send(txData);
    }
  }

  // handle change on live publisher input fields
  const handleChange = (event) => {
    if(event.target.name === "topic") setPubTopic(event.target.value);
    if(event.target.name === "message") setPubMsg(event.target.value);
    if(event.target.name === "qos") setPubQos(event.target.value);
  }

  // handle click on live topics table
  const handleClick = (event) => {
    if (! ws.current) return;

    if (ws.current.readyState === ws.current.OPEN){
      setLiveTopic(event.target.id);
      var txData = (JSON.stringify(
        {
          request:"live",
          topic: event.target.id
        }
      ));
      ws.current.send(txData);
    }
  }

  return(
    <Page>
      <Column>
        <Row>
          {liveTopic && 
            <LiveChart topic={liveTopic} data={rxData}/>
          }
        </Row>
        <Row>
          <LiveTopics 
            onClick={handleClick}
            newTopics={newTopics}
          />
        </Row>
        <Row className="top space">
          <Row>
            <LivePublisher
              onSubmit={handlePublish}
              onChange={handleChange}
            />
          </Row>
          <Column className="top">
            <TableOfSubs/>
          </Column>
        </Row>
      </Column>
    </Page>
  );
}

export default LiveDash;