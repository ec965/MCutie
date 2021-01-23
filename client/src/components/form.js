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
    <div className="form-label">
      <label>{props.children}</label>
      <input name={props.name} placeholder={props.placeholder} onChange={props.onChange} type={props.type}/>
    </div>
  );
}

export const FormButton = (props) => {
  return(
    <input className="form-button" type="submit" value={props.label}/>
  );
}