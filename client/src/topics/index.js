import React, { useEffect, useState } from "react";
import {URL, GETTOPICS} from "../util.js";
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";
import TopicPage from './page.js';

const TableOfTopics = (props) => {
  const [topics, setTopics] = useState([]);

  useEffect(()=>{
    fetch(URL + GETTOPICS)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        console.log(data);
      })
  }, []);

  const routeUrl = '/';
  
  const url_replacement = (str) => {
    return str.replaceAll("/", "_").replaceAll("%",'-');
  }

  const rows = topics.map((r, i) => {
    return(
      <TableRow key={i}>
        <TableItem>
          {r.topic}
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