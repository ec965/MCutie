import React , {useState, useEffect} from "react";
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {
  Link,
} from "react-router-dom";
import {URL, GETMSG, upperFirstLetter} from "../util.js";
import GenericChart from "./chart.js";
import {Column} from "../components/layout.js";
import DataTable from './table.js';

export const TableOfTopics = (props) => {

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

export const TopicChart = (props) => {

  const [data, setData] = useState([]);
  const label = upperFirstLetter(props.topic.split("/")[props.topic.split("/").length-2]);
  const unit = props.topic.split("/")[props.topic.split("/").length-1];

  useEffect(() => {
    fetch(URL + GETMSG + props.topic)
      .then((response) => response.json())
      .then((data) => {
        for (let i=0; i<data.length; i++){
          data[i].message = parseFloat(data[i].message);
          data[i].createdAt = Date.parse(data[i].createdAt);
        }
        setData(data);
        // console.log(JSON.stringify(data, null , 2));
      });
  }, [props.topic]);


  return (
    <Column>
      <GenericChart
        topic={props.topic}
        unit={unit}
        label={label}
        data={data}
      />
      <DataTable 
        data={data}
        unit={unit}
        label={label}
      />
    </Column>
  );
};
