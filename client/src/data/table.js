import React from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {formatFullDateTime} from '../util.js';

const DataTable = (props) => {
  const rows = props.data.reverse().map((r,i) => { //get it from oldest to newest
    let strTime = formatFullDateTime(r.createdAt);
    return(
      <TableRow key={i}>
        <TableItem>
          {props.data.length-i}
        </TableItem>
        <TableItem>
          {r.message}
        </TableItem>
        <TableItem>
          {strTime}
        </TableItem>
      </TableRow>
    );
  });

  return(
    <Table>
      <TableRow>
        <TableHead>Index</TableHead>
        <TableHead>{`${props.label} (${props.unit})`}</TableHead>
        <TableHead>Time</TableHead>
      </TableRow>
      {rows}
    </Table>
  );
}
export default DataTable;