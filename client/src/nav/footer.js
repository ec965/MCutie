import React from 'react';
import {Column} from '../components/layout';

const Footer = (props) => {
  return(
    <footer className="footer">
      <Column>
        <p>Enoch Chau</p>
        <p> CopyPlease 2021</p>
      </Column>
      <a href="https://github.com/ec965/mcutie">GitHub</a>
    </footer>
  )
}

export default Footer;