import React, { useEffect, useState } from "react";
import {URL, GETTOPICS} from "../util.js";
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";
import TopicPage from './page.js';
import Page from '../components/page.js';

const TableOfTopics = (props) => {
  const [topics, setTopics] = useState([]);

  useEffect(()=>{
    fetch(URL + GETTOPICS)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
      })
  }, []);

  const routeUrl = '/t';
  
  const url_replacement = (str) => {
    return str.replaceAll("/", "_").replaceAll("%",'-');
  }

  const rows = topics.map((r, i) => {
    return(
      <TableRow key={i}>
        <TableItem>
          {i+1}
        </TableItem>
        <TableItem>
          <Link to={`${routeUrl}/${url_replacement(r.topic)}`}>
            {r.topic}
          </Link>
        </TableItem>
      </TableRow>
    );
  });

  const routes = topics.map((r,i)=> {
    return(
      <Route key={i} path={`${routeUrl}/${url_replacement(r.topic)}`}>
        <TopicPage topic={r.topic}/>
      </Route>
    );
  });


  return (
    <Switch>
      <Route exact path={`${routeUrl}`}>
        <Page>
          <Table>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Topics</TableHead>
            </TableRow>
            {rows}
          </Table>
        </Page>
      </Route>
      {routes}
    </Switch>
  );
}

export default TableOfTopics;