export const upperFirstLetter = (str) => {
  return str[0].toUpperCase() + str.substr(1);
}

export const URL = "http://0.0.0.0:5000/";
export const GETTOPICS = "mqtt/t";
export const GETMSG = "mqtt/m?topic=";
export const GETSUB = "mqtt/s";