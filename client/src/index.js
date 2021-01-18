import { render } from '@testing-library/react';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';

const MyChart = (props) => {
  const tt_format = (value, name, props) => {
    return [value, "data"]
  }
  return(
    <LineChart width={1600} height={400} data={props.data}>
      <Line type="monotone" dataKey="payload" dot={false}/>
      <CartesianGrid stroke="#ccc"/>
      <Tooltip formatter={tt_format}/>
      <XAxis
        dataKey="timestamp"
        type="number"
        scale="time"
        domain={['dataMin', 'dataMax']}
        label={{value:"Time (s)", position:'insideBottom', offset:0}}
      />
      <YAxis/>
    </LineChart>
  );
}

const App = (props) => {
  const [data, setData] = useState([]);
  const topic = "esp32-temp/in/dht11/temperature/C";
  const url = "http://0.0.0.0:5000/mqtt/q?t=" + topic;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  },[]);  

  return(
    <div>
      <h1>{topic}</h1>
      <MyChart data={data}/>
      <table>
        <tr>
          <th>Time</th>
          <th>Data</th>
        </tr>
        {data.map((point, index) =>{
          const dateobj = new Date(point.timestamp);
          return(
            <tr key={index}>
              <td>{dateobj.toLocaleString()}</td>
              <td>{point.payload}</td>
            </tr>
          );
        }
        )}
      </table>
    </div>

  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);