import React, {useEffect, useState} from 'react';
import Page from "../components/page.js";
import {Column, Row} from "../components/layout.js";
import TableOfSubs from "./subs.js";
import TableOfTopics from "./topics.js";
import TopicChart from "./chart";
import {URL, GETSUB, GETTOPICS, url_replacement} from "../util.js";
import {Route, Switch} from "react-router-dom";

const DashBoard = (props) => {
  const routeUrl = "/";
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
      <Route key={i} path={r.routeUrl}>
        <TopicChart topic={r.topic}/>
      </Route>
    );
  });


  return(
    <Page>
      <Column>
        <Row>
          {/* default route should be the live web socket*/}
          <Switch>
            {charts}
          </Switch>
        </Row>
        <Row>
          <Column>
            <TableOfTopics routeUrl={routeUrl} topics={topics}/>
          </Column>
          <Column>
            <TableOfSubs/>
          </Column>
        </Row>
      </Column>
    </Page>
  );
}


export default DashBoard;