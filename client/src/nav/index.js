import React from 'react';
import TableOfTopics from "../topics/index.js";
import TableOfSubs from "../subs/index.js";
import {NavBar, NavItem, NavLogo, NavGroup} from "./navitems.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const MyNavBar = (props) => {
  return(
    <Router>
      <NavBar>

        <NavLogo>
          <Link to="/">MCutie</Link>
        </NavLogo>

        <NavGroup>
          <NavItem>
            <Link to="/t">Topics</Link>
          </NavItem>
          <NavItem>
            <Link to="/s">Subscriptions</Link>
          </NavItem>
          <NavItem>
            MQTT Live
          </NavItem>
        </NavGroup>

      </NavBar>

      <Switch>
        <Route exact path="/">
          <div>
            <h1>Hello World!</h1>
          </div>
        </Route>
        <Route path="/t">
          <TableOfTopics/>
        </Route>
        <Route path="/s">
          <TableOfSubs/>
        </Route>
      </Switch>
    </Router>
  );
}

export default MyNavBar;