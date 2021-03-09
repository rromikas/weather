import weatherIconsMappings from "icons/mappings.json";
import weatherIconsNames from "icons/names.json";

export const getOrdinalEnding = (day) => {
  return day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
};
export const convertCelciusToFarenheit = (c) => {
  return (c * 9) / 5 + 32;
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1);

export const getIconClass = (id, neutral = false) => {
  var prefix = "wi wi-";
  var code = id;
  var icon = weatherIconsMappings[code].icon;

  // If we are not in the ranges mentioned above, add a day/night prefix.
  if (!(code > 699 && code < 800) && !(code > 899 && code < 1000) && !neutral) {
    icon = "day-" + icon;
  }

  //if there is no such neutral icon
  if (!weatherIconsNames.includes(icon)) {
    icon = "day-" + icon;
  }
  // Finally tack on the prefix.
  icon = prefix + icon;
  return icon;
};
