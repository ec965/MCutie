import React from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";

const LiveTopics = (props) => {
  const rows = props.topics.map((r,i) => {
    return(
      <TableRow key={i}>
        <TableItem className="link" onClick={props.onClick} id={r.topic}>
          {r.topic}
        </TableItem>
      </TableRow>
    );
  });
  return(
    <Table>
      <TableRow>
        <TableHead>Live Topics</TableHead>
      </TableRow>
      {rows}
    </Table>
  )
}
export default LiveTopics;