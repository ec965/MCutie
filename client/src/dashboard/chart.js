import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {colors} from '../util.js';

// Do/HH:mm
const formatDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getDate()}/${time.getHours()}:${time.getMinutes()}`;
}
// HH:mm:ss
const formatTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getMonth()+1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

const CustomToolTip = ({payload, label, active, unit}) => {
  if(active && payload !== null && typeof payload !== "undefined"){
    if (payload.length > 0){
      return(
        <div className="tool-tip">
          <p>{`${payload[0].value} ${unit}`}</p>
          <p>{formatTime(label)}</p>
        </div>
      );
    }
  }
  return(<p>placeholder</p>);
}

const GenericChart = (props) => {
  const [width, setWidth] = useState(960);
  const [height, setHeight] = useState(540)
  const [data, setData] = useState([]);
  const margin = 15;
  const unit = props.unit;

  useEffect(()=>{
    if (window.innerWidth < 1000){
      setWidth(640);
      setHeight(360);
    }
    if (window.innerWidth < 400){
      setWidth(256);
      setHeight(144);
    }

    for (let i=0; i<props.data.length; i++){
      props.data[i].message = parseFloat(props.data[i].message);
    }
    setData(props.data); // we need to rerender the component every time props.data changes
  },[props.data]);



  return (
    <div className="chart">
      <h2>{props.topic}</h2>
      <LineChart width={width} height={height} data={data}
        margin={{top:margin, bottom: margin, left: margin, right: margin}}>
        <Line 
          type="linear" 
          dataKey="message" 
          dot={false} 
          stroke={colors.magenta} 
          strokeWidth={1.75}
        />
        <CartesianGrid stroke={colors.base1} />
        <Tooltip
          content={<CustomToolTip/>}
          unit={unit}
        />
          {/* formatter={(value, name, props) => [`${value} ${unit}`,]}
          labelFormatter={(value) => formatTime(value)}
        /> */}
        <XAxis
          dataKey="createdAt"
          scale="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          interval="preserveStartEnd"
          tickFormatter={unixtime => formatDateTime(unixtime)}
          label={{ value: "Time (Date/HH:mm)", position: "insideBottom", offset: -8, fill:colors.base1 }}
          stroke={colors.base2}
          height={42}
          allowDataOverflow={false}
        />
        <YAxis
          label={{ value: `${props.label} (${props.unit})`, position: "insideLeft", angle: -90, fill:colors.base1}}
          stroke={colors.base2}
          dataKey="message"
          type="number"
          interval={0}
        />
      </LineChart>
    </div>
  );
}

export default GenericChart;