import React from 'react';
import GenericChart from '../dashboard/chart';
import {upperFirstLetter} from '../util.js';

export const LiveChart = (props) => {
  const label = upperFirstLetter(props.topic.split("/")[props.topic.split("/").length-2]);
  const unit = props.topic.split("/")[props.topic.split("/").length-1];
  return(
    <GenericChart
      topic={props.topic}
      unit={unit}
      label={label}
      data={props.data}
    />
  );
}
export default LiveChart;