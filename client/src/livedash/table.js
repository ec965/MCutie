import React, {useState, useEffect} from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import qs from "querystring";
import { URL, GETTOPICS, usePrevious } from '../util.js';
import Toggle from '../components/toggle.js';
import {Column} from '../components/layout';
import LiveChart from './chart';

const LiveTopics = (props) => {
  const [toggleDel, setToggleDel] = useState(false);
  // topics for the live topic table
  const [topics, setTopics] = useState([]);
  const [liveTopic, setLiveTopic] = useState("");
  const [chartData, setChartData] = useState([]);
  
  const prevTopic = usePrevious(liveTopic)

  useEffect(() => {
    props.ws.onmessage = (event) => {
      var data = JSON.parse(event.data);
      if (data.response === "newtopic"){
        setTopics(data.payload);
      }
      if (data.response === "newdata"){
        // check if the topics line up, if they don't, reset the chart data
        var newChartData = [];

        if (liveTopic === prevTopic){
          newChartData = [...chartData];
        }

        var messages = data.payload.messages
        for (let i=0; i<messages.length; i++){
          messages[i].message = parseFloat(messages[i].message);
          messages[i].createdAt = Date.parse(messages[i].createdAt);
          newChartData.push(messages[i]);
        }
        setChartData(newChartData);
      }
    }
  })

  // delete topics & it's msgs from the database
  const handleDelete = (event) =>{
    if (toggleDel){
      const reqOpt = {
        method: "DELETE",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: qs.stringify({topic:event.target.id})
      }
      fetch(URL+GETTOPICS, reqOpt)
        .then((res)=>{
          if(!res.ok){
            throw new Error(res.status);
          } else return res;
        })
        .then(() => props.ws.send(JSON.stringify({request:'delete'})))
        .catch((err) => console.log(err));
      // after deletion, we need to force the local data array to reset
    }
  }

  // toggle allow deletion on the client
  const handleSwitch = (event) => {
    setToggleDel(event.target.checked);
  }

  // handle clicking on a live topic
  const handleClick = (event) => {
    setLiveTopic(event.target.id);
    var txData = (JSON.stringify({
      request: "live",
      payload: {
        topic: event.target.id
      }
    }))
    props.ws.send(txData);
  }

  const rows = topics.map((r,i) => {
    return(
      <TableRow key={i}>
        <TableItem className="link" onClick={handleClick} id={r.topic}>
          {r.topic}
        </TableItem>
        <TableItem>
          <i 
            onClick={handleDelete} 
            name={r.topic}
            id={r.topic} 
            className={"fas fa-times " + (toggleDel && "link")}
          />
        </TableItem>
      </TableRow>
    );
  });

  return(
    <Column>
      {liveTopic && <LiveChart ws={props.ws} topic={liveTopic} data={chartData}/>}
      <Table>
        <TableRow>
          <TableHead>Live Graph</TableHead>
          <TableHead>
            <Toggle onClick={handleSwitch} className="table-toggle"/>
          </TableHead>
        </TableRow>
        {rows}
      </Table>
    </Column>
  )
}
export default LiveTopics;