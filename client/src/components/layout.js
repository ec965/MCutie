import React from 'react';

export const Column = (props) => <div className={"col " + props.className}>{props.children}</div>
export const Row = (props) => <div className={"row " + props.className }>{props.children}</div>