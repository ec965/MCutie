export const upperFirstLetter = (str) => {
  return str[0].toUpperCase() + str.substr(1);
}
export const url_replacement = (str) => {
  return str.replaceAll("/", "_").replaceAll("%",'-');
}

export const URL = "http://localhost:5000/";
export const GETTOPICS = "mqtt/t";
export const GETMSG = "mqtt/m?topic=";
export const GETSUB = "mqtt/s";