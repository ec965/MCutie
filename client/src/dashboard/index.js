import React from "react";
import Page from "../components/page.js";
import {Column, Row} from "../components/layout.js";
import TableOfSubs from "../subs/index.js";
import TableOfTopics from "../topics/index.js";
import TopicChart from "../topics/chart";

const DashBoard = (props) => {
  const topic = "esp32-temp/in/dht11/humidity/%RH";
  return(
    <Page>
      <Column>
        <Row>
          <TopicChart topic={topic}/>
        </Row>
        <Row>
          <Column>
            <TableOfTopics/>
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