import React, {useState, useEffect} from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import qs from "querystring";
import { URL, GETTOPICS } from '../util.js';
import Toggle from '../components/toggle.js';

const LiveTopics = (props) => {
  const [toggleDel, setToggleDel] = useState(false);
  // topics for the live topic table
  const [topics, setTopics] = useState([]);
  const [refetch, setRefetch] = useState(true);

  // initial fetch to get topics
  useEffect(() => {
    fetch(URL + GETTOPICS)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
      });
  }, [refetch]);

  // update topics based on websocket output
  useEffect(() => {
    if(props.newTopics.length !== 0){
      setTopics(props.newTopics);
    }
  }, [props.newTopics]);

  // delete topics & it's msgs from the database
  const handleDelete = (event) =>{
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
      .then(() => setRefetch(!refetch))
      .catch((err) => console.log(err));
  }

  // toggle allow deletion on the client
  const handleSwitch = (event) => {
    setToggleDel(event.target.checked);
  }

  const rows = topics.map((r,i) => {
    return(
      <TableRow key={i}>
        <TableItem className="link" onClick={props.onClick} id={r.topic}>
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
    <Table>
      <TableRow>
        <TableHead>Live Graph</TableHead>
        <TableHead>
          <Toggle onClick={handleSwitch} className="table-toggle"/>
        </TableHead>
      </TableRow>
      {rows}
    </Table>
  )
}
export default LiveTopics;