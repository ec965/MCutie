import React, {useState, useEffect} from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import qs from "querystring";
import { URL, GETTOPICS } from '../util.js';

const LiveTopics = (props) => {
  const [toggleDel, setToggleDel] = useState(false);
  // topics for the live topic table
  const [topics, setTopics] = useState([]);
  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    fetch(URL + GETTOPICS)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
      });
  }, [refetch]);

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

  const rows = topics.map((r,i) => {
    return(
      <TableRow key={i}>
        <TableItem className="link" onClick={props.onClick} id={r.topic}>
          {r.topic}
        </TableItem>
        {props.toggleDel && 
          <TableItem onClick={handleDelete} id={r.topic}>
            X
          </TableItem>
        }
      </TableRow>
    );
  });
  return(
    <Table>
      <TableRow>
        <TableHead>Live Topics</TableHead>
        {toggleDel && 
          <TableHead>Delete</TableHead>
        }
      </TableRow>
      {rows}
    </Table>
  )
}
export default LiveTopics;