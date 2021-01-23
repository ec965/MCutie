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
import Footer from "./footer";

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
        <NavGroup>
          <h1>h1</h1>
          <h2>h2</h2>
          <h3>h3</h3>
          <h4>h4</h4>
          <h5>h5</h5>
          <h6>h6</h6>
          <p>p</p>
        </NavGroup>
      </NavBar>

      <Switch>
        <Route path="/live">
          <LiveDash/>
        </Route>
        <Route path="/">
          <DashBoard/>
        </Route>
      </Switch>

      <Footer/>
    </Router>
  );
}

export default MyNavBar;