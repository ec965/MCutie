import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Do/HH:mm
const formatDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getDate()}/${time.getHours()}:${time.getMinutes()}`;
}
// HH:mm:ss
const formatTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}



const GenericChart = (props) => {
  const margin = 15;
  return (
    <div>
      <h2>{props.topic}</h2>
      <LineChart width={960} height={540} data={props.data}
        margin={{top:margin, bottom: margin, left: margin, right: margin}}>
        <Line type="monotone" dataKey="message" dot={false} />
        <CartesianGrid stroke="#ccc" />
        <Tooltip
          formatter={(value, name, props) => [`${value} ${props.unit}`,]}
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
          label={{ value: `${props.label} (${props.unit})`, position: "insideLeft", angle: -90}}
        />
      </LineChart>
    </div>
  );
}

export default GenericChart;