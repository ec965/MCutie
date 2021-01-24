import React from 'react';

export const Table = (props) => {
  return(
    <table className="table">
      <tbody>
        {props.children}
      </tbody>
    </table>
  );
}

export const TableHead = (props) => {
  return(
    <th className={"table-head " + props.className}>{props.children}</th>
  );
}

export const TableItem = (props) => {
  return(<td name={props.name} onClick={props.onClick} id={props.id} className={"table-item " + props.className}>{props.children}</td>);
}

export const TableRow = (props) => {
  return (<tr onClick={props.onClick} id={props.id} className={"table-row " + props.className}>{props.children}</tr>)
}