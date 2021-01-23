import React from "react";
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {
  Link,
} from "react-router-dom";

const TableOfTopics = (props) => {

  const rows = props.topics.map((r, i) => {
    return(
      <TableRow key={i}>
        <TableItem>
          <Link to={r.routeUrl}>
            {r.topic}
          </Link>
        </TableItem>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableRow>
        <TableHead>Topics</TableHead>
      </TableRow>
      {rows}
    </Table>
  );
}

export default TableOfTopics;