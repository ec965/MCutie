import React from 'react';
import {NavBar, NavItem, NavLogo, NavGroup} from "./navitems.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import DashBoard from "../dashboard/index.js"

const MyNavBar = (props) => {
  return(
    <Router>
      
      <NavBar>
        <NavLogo>
          <Link to="/">MCutie</Link>
        </NavLogo>
      </NavBar>

      <Switch>
        <Route path="/">
          <DashBoard/>
        </Route>
      </Switch>
    </Router>
  );
}

export default MyNavBar;