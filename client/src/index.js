import React from "react";
import ReactDOM from "react-dom";
import './css/stylesheet.css';
import MyNavBar from "./nav/index.js";

const App = (props) => {
  return (
    <MyNavBar/>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
