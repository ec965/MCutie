import React, {useEffect, useState} from 'react';
import {URL, GETSUB} from "../util.js";
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import Page from "../components/page.js";

const TableOfSubs = (props) => {
  const [subs, setSubs] = useState([]);

  useEffect(()=>{
    fetch(URL+GETSUB)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSubs(data);
      })
  }, []);

  const rows = subs.map((r, i) => {
    return(
      <TableRow key={i}>
        <TableItem>{r["topic"]}</TableItem>
        <TableItem>{r["qos"]}</TableItem>
      </TableRow>
    );
  });

  return(
    <Table>
      <TableRow>
        <TableHead>Subscription</TableHead>
        <TableHead>QoS</TableHead>
      </TableRow>
      {rows}
    </Table>
  );
}

export default TableOfSubs;