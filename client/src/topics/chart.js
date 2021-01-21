
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const formatDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getDate()}/${time.getHours()}:${time.getMinutes()}`;
}
const formatTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

const MyChart = (props) => {
  const {data, yaxis, unit} = props;
  const margin = 15;
  return (
    <div>
      <h2>{props.title}</h2>
      <LineChart width={800} height={400} data={data}
        margin={{top:margin, bottom: margin, left: margin, right: margin}}>
        <Line type="monotone" dataKey="message" dot={false} />
        <CartesianGrid stroke="#ccc" />
        <Tooltip
          formatter={(value, name, props) => [`${value} ${unit}`,]}
          labelFormatter={(value) => formatTime(value)}
        />
        <XAxis
          dataKey="time"
          scale="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={unixtime => formatDateTime(unixtime)}
          label={{ value: "Time (Date/HH:mm)", position: "insideBottom", offset: -9 }}
        />
        <YAxis
          type="number"
          domain={[0, 'dataMax + 2']}
          label={{ value: `${yaxis} (${unit})`, position: "insideLeft", angle: -90}}
        />
      </LineChart>
    </div>
  );
};

export default MyChart;