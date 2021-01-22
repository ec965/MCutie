import React, {useEffect, useState} from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { URL, GETMSG, upperFirstLetter } from "../util.js";

const formatDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getDate()}/${time.getHours()}:${time.getMinutes()}`;
}
const formatTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

const TopicChart = (props) => {

  const [data, setData] = useState([]);
  const label = upperFirstLetter(props.topic.split("/")[props.topic.split("/").length-2])
  const unit = props.topic.split("/")[props.topic.split("/").length-1];

  useEffect(() => {
    fetch(URL + GETMSG + props.topic)
      .then((response) => response.json())
      .then((data) => {
        for(let i=0; i<data.length; i++){
          data[i]["createdAt"] = Date.parse(data[i]["createdAt"]);
        }
        setData(data);
        // console.log(JSON.stringify(data, null , 2));
      });
  }, [props.topic]);

  const margin = 15;

  return (
    <div>
      <h2>{props.topic}</h2>
      <LineChart width={960} height={540} data={data}
        margin={{top:margin, bottom: margin, left: margin, right: margin}}>
        <Line type="monotone" dataKey="message" dot={false} />
        <CartesianGrid stroke="#ccc" />
        <Tooltip
          formatter={(value, name, props) => [`${value} ${unit}`,]}
          labelFormatter={(value) => formatTime(value)}
        />
        <XAxis
          dataKey="createdAt"
          scale="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={unixtime => formatDateTime(unixtime)}
          label={{ value: "Time (Date/HH:mm)", position: "insideBottom", offset: -9 }}
        />
        <YAxis
          type="number"
          domain={[0, 'dataMax + 2']}
          label={{ value: `${label} (${unit})`, position: "insideLeft", angle: -90}}
        />
      </LineChart>
    </div>
  );
};

export default TopicChart;