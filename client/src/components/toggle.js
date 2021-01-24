import React from 'react';

const Toggle = (props) => {
  return(
    <label className={"switch " + props.className}>
      <input type="checkbox" onClick={props.onClick}/>
      <span className="slider"></span>
    </label>
  );
}
export default Toggle;