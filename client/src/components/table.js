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
    <th className="table-head">{props.children}</th>
  );
}

export const TableItem = (props) => {
  return(<td className="table-item">{props.children}</td>);
}

export const TableRow = (props) => {
  return (<tr className="table-row">{props.children}</tr>)
}