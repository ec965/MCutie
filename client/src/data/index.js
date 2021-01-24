import React, {useEffect, useState} from 'react';
import Page from "../components/page.js";
import {Column, Row} from "../components/layout.js";
import {TopicChart, TableOfTopics} from "./topics.js";
import {URL, GETTOPICS, url_replacement} from "../util.js";
import {Route, Switch} from "react-router-dom";

const DashBoard = (props) => {
  const routeUrl = "/t/";
  const [topics, setTopics] = useState([]);

  useEffect(()=> {
    fetch(URL + GETTOPICS)
      .then((res) => res.json())
      .then((data) => {
        // generate the routeUrl's from the fetch'd data
        for(let i=0; i<data.length; i++){
          data[i]["routeUrl"] = routeUrl + url_replacement(data[i]["topic"]); 
        }
        setTopics(data);
      });
  }, []);

  const charts = topics.map((r,i) => {
    return(
      <Route key={i} exact path={r.routeUrl}>
        <TopicChart topic={r.topic}/>
      </Route>
    );
  });

  return(
    <Page>
      <Column>
        <Row>
          <TableOfTopics routeUrl={routeUrl} topics={topics}/>
        </Row>
        <Row>
          <Switch>
            {charts}
          </Switch>
        </Row>
      </Column>
    </Page>
  );
}


export default DashBoard;