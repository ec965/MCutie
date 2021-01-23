import React from 'react';
import {NavBar, NavItem, NavLogo, NavGroup} from "./navitems.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import DashBoard from "../dashboard/index.js"
import LiveDash from '../livedash/index.js'

const MyNavBar = (props) => {
  return(
    <Router>
      
      <NavBar>
        <NavGroup>
          <NavLogo>
            <Link to="/">MCutie</Link>
          </NavLogo>
          <NavItem>
            <Link to="/live">Live</Link>
          </NavItem>
        </NavGroup>
      </NavBar>

      <Switch>
        <Route exact path="/">
          <DashBoard/>
        </Route>
        <Route path="/live">
          <LiveDash/>
        </Route>
      </Switch>
    </Router>
  );
}

export default MyNavBar;