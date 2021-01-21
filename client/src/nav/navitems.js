import React from 'react';

export const NavGroup = (props) => {
  return(
    <div className="nav-group">
      {props.children}
    </div>
  );
}

export const NavBar = (props) => {
  return(
    <div className="nav-bar">
      {props.children}
    </div>
  );
}

export const NavItem = (props) => {
  return(
    <div className="nav-item">
      <h2>{props.children}</h2>
    </div>
  )
}

export const NavLogo = (props) => {
  return(
    <div className="nav-logo">
      <h1>{props.children}</h1>
    </div>
  )
}