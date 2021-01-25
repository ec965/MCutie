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
// const LiveDash = (props) => {
//   const ws = useRef(null);

//   // data coming in on the web socket
//   const [newData, setNewData] = useState();
//   // new topics
//   const [newTopic, setNewTopic] = useState();
//   // current live topic to display on the chart
//   const [liveTopic, setLiveTopic] = useState("");

//   // states for live publisher form
//   const [pubTopic, setPubTopic] = useState("");
//   const [pubMsg, setPubMsg] = useState("");
//   const [pubQos, setPubQos] = useState(0);

//   // websocket stuff
//   useEffect(()=>{
//     ws.current = new WebSocket(WEBSOCKET);
//     ws.current.onopen = () => {
//       console.log("websocket connected");
//     }
//     ws.current.onclose = () => {
//       console.log("websocket closed");
//     }
    
//     // ws.current.onmessage = (event) => {
//     //   let data = JSON.parse(event.data);

//     //   if (data.request === "newdata"){
//     //     setNewData(data.payload);
//     //   } 
//     //   else if (data.request === "newtopic"){
//     //     setNewTopic(data.payload);
//     //   }
//     // }

//     return () => {
//       ws.current.close();
//     };

//   }, []); 

//   // handle submit on live publisher
//   const handlePublish = (event) => {
//     event.preventDefault();
//     if (!ws.current) return;

//     if (ws.current.readyState === ws.current.OPEN){
//       var txData = (JSON.stringify(
//         {
//           request: "publish",
//           payload:{
//             topic: pubTopic,
//             message: pubMsg,
//             qos: pubQos,
//           }
//         }
//       ));
//       ws.current.send(txData);
//     }
//   }

//   // handle change on live publisher input fields
//   const handleChange = (event) => {
//     if(event.target.name === "topic") setPubTopic(event.target.value);
//     if(event.target.name === "message") setPubMsg(event.target.value);
//     if(event.target.name === "qos") setPubQos(event.target.value);
//   }


//   return(
//     <Page>
//       <Column>
//         <Row>
//           {liveTopic && 
//             <LiveChart topic={liveTopic} socket={ws.current}/>
//           }
//         </Row>
//         <Row>
//           <LiveTopics 
//             onClick={handleClick}
//             newTopics={newTopic}
//           />
//         </Row>
//         <Row className="top space">
//           <Row>
//             <LivePublisher
//               onSubmit={handlePublish}
//               onChange={handleChange}
//             />
//           </Row>
//           <Column className="top">
//             <TableOfSubs/>
//           </Column>
//         </Row>
//       </Column>
//     </Page>
//   );
// }

export default LiveDash;