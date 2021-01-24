import React from 'react';

const Switch = (props) => {
  return(
    <label className={"switch " + props.className}>
      <input type="checkbox" onClick={props.onClick}/>
      <span className="slider"></span>
    </label>
  );
}
export default Switch;