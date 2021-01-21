import React, {useEffect, useState} from "react";
import MyChart from "./chart.js";
import { URL, GETMSG, upperFirstLetter } from "../util.js";
import Page from "../components/page.js";

const TopicPage = (props) => {

  const [data, setData] = useState([]);
  const label = upperFirstLetter(props.topic.split("/")[props.topic.split("/").length-2])
  const unit = props.topic.split("/")[props.topic.split("/").length-1];
  
  useEffect(() => {
    fetch(URL + GETMSG + props.topic)
      .then((response) => response.json())
      .then((data) => {
        setData(data["mqtt_msgs"]);
      });
  }, [props.topic]);

  return (
    <Page>
      <MyChart 
        title={props.topic}
        data={data} 
        yaxis={label}
        unit={unit}
      />
    </Page>
  );
}

export default TopicPage;