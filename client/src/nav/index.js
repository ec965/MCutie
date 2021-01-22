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
import Page from "../components/page.js";
import DashBoard from "../dashboard/index.js"

const MyNavBar = (props) => {
  return(
    <Router>
      <NavBar>
        <NavGroup>
          <NavLogo>
            <Link to="/">MCutie</Link>
          </NavLogo>
          <NavItem>
            MQTT Live
          </NavItem>
        </NavGroup>
      </NavBar>
      <Switch>
        <Route exact path="/">
          <Page>
            <DashBoard/>
          </Page>
        </Route>
      </Switch>
    </Router>
  );
}

export default MyNavBar;