import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {colors, formatDateTime, formatShortDateTime} from '../util.js';


const CustomToolTip = ({payload, label, active, unit}) => {
  if(active && payload !== null && typeof payload !== "undefined"){
    if (payload.length > 0){
      return(
        <div className="tool-tip">
          <p>{`${payload[0].value} ${unit}`}</p>
          <p>{formatDateTime(label)}</p>
        </div>
      );
    }
  }
  return(<p>placeholder</p>);
}

const GenericChart = (props) => {
  const [width, setWidth] = useState(960);
  const [height, setHeight] = useState(540)
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
  });

  return (
    <div className="chart">
      <h2>{props.topic}</h2>
      <LineChart width={width} height={height} data={props.data}
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
        <XAxis
          dataKey="createdAt"
          scale="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          interval="preserveStartEnd"
          tickFormatter={unixtime => formatShortDateTime(unixtime)}
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