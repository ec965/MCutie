import React from 'react';
import {Column} from '../components/layout';

const Footer = (props) => {
  return(
    <footer className="footer">
      <Column>
        <a href="https://enochchau.com">
          <div>Enoch Chau</div>
          <div>2021</div>
        </a>
      </Column>
      <a href="https://github.com/ec965/mcutie">
        <i className="fab fa-github"></i>
      </a>
    </footer>
  )
}

export default Footer;