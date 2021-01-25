
import {useRef, useEffect} from 'react';

export const upperFirstLetter = (str) => {
  if (typeof str !== 'undefined' && str.length > 0){
    return str[0].toUpperCase() + str.substr(1);
  }
}
export const url_replacement = (str) => {
  return str.replaceAll("/", "_").replaceAll("%",'-');
}

// api routes
const IPADDRESS = '192.168.1.30';
const PORT = '5000';

export const URL = `http://${IPADDRESS}:${PORT}/`;
export const GETTOPICS = "mqtt/t";
export const GETMSG = "mqtt/m?topic=";
export const GETSUB = "mqtt/s";
export const WEBSOCKET=`ws://${IPADDRESS}:${PORT}/live`;


export const colors={
  base00:   '#657B83',
  base01:   '#586E75',
  base02:   '#073642',
  base03:   '#002b36',
  base1:    '#93a1a1',
  base2:    '#eee8d5',
  base3:    '#fdf6e3',
  yellow:   '#b58900',
  orange:   '#cb4b16',
  red:      '#dc322f',
  magenta:  '#d33682',
  violet:   '#6c71c4',
  blue:     '#268bd2',
  cyan:     '#2aa198',
  green:    '#859900',
}

// Do/HH:mm
export const formatShortDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getDate()}/${time.getHours()}:${time.getMinutes()}`;
}
// MM/DD HH:mm:ss
export const formatDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getMonth()+1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

export const formatFullDateTime = (unixtime) => {
  const time = new Date(unixtime);
  return `${time.getMonth()+1}/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}