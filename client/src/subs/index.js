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
    const time = new Date(r.createdAt);
    return(
      <TableRow key={i}>
        <TableItem>
          {i+1}
        </TableItem>
        <TableItem>{r.topic}</TableItem>
        <TableItem>{r.qos}</TableItem>
        <TableItem>{time.toLocaleString()}</TableItem>
      </TableRow>
    );
  });

  return(
    <Page>
      <Table>
        <TableRow>
          <TableHead>Index</TableHead>
          <TableHead>Subscription</TableHead>
          <TableHead>QoS</TableHead>
          <TableHead>Added at</TableHead>
        </TableRow>
        {rows}
      </Table>
    </Page>
  );
}

export default TableOfSubs;