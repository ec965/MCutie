import React from 'react';

export const Form = (props) => {
  return(
    <form onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
}

export const FormItem = (props) => {
  return(
    <label className="form-label">{props.children}
      <input name={props.name} placeholder={props.placeholder} onChange={props.onChange} type={props.inputType}/>
    </label>
  );
}

export const FormButton = (props) => {
  return(
    <input className="form-button" type="submit" value={props.label}/>
  );
}