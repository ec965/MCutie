export const upperFirstLetter = (str) => {
  if (typeof str !== 'undefined' && str.length > 0){
    return str[0].toUpperCase() + str.substr(1);
  }
}
export const url_replacement = (str) => {
  return str.replaceAll("/", "_").replaceAll("%",'-');
}

export const URL = "http://localhost:5000/";
export const GETTOPICS = "mqtt/t";
export const GETMSG = "mqtt/m?topic=";
export const GETSUB = "mqtt/s";
export const WEBSOCKET="ws://localhost:5000/live"


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