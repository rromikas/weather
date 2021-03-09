import { MdArrowBack } from "react-icons/md";
import { store } from "store";
import { connect } from "react-redux";
import { useEffect } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import moment from "moment";
import weatherIconsMappings from "icons/mappings.json";
import weatherIconsNames from "icons/names.json";

const getOrdinalEnding = (day) => {
  return day === 1 ? "st" : day === 2 ? "nd" : day == 3 ? "rd" : "th";
};
const convertCelciusToFarenheit = (c) => {
  return (c * 9) / 5 + 32;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1);

const getIconClass = (id, neutral = false) => {
  var prefix = "wi wi-";
  var code = id;
  var icon = weatherIconsMappings[code].icon;

  // If we are not in the ranges mentioned above, add a day/night prefix.
  if (!(code > 699 && code < 800) && !(code > 899 && code < 1000) && !neutral) {
    icon = "day-" + icon;
  }

  //if there is not such neutral icon
  if (!weatherIconsNames.includes(icon)) {
    icon = "day-" + icon;
  }
  // Finally tack on the prefix.
  icon = prefix + icon;
  return icon;
};

const CityForecastsPage = ({ location, weekForecast, todayForecast, isCelcius }) => {
  const getBack = () => {
    store.dispatch({ type: "SET_LOCATION", payload: null });
  };

  useEffect(() => {
    if (location) {
      (async function getForecasts() {
        let w = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,alerts&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        ).then((x) => x.json());
        // localStorage.setItem("weather", JSON.stringify(res));
        // let w = JSON.parse(localStorage.getItem("weather"));
        const { morn, day, eve, night } = w.daily[0].temp;
        const now = w.hourly[0].temp;
        const nowIcon = w.hourly[0].weather[0].id;
        store.dispatch({
          type: "SET_TODAY_FORECAST",
          payload: { morning: morn, day, evening: eve, night, now, nowIcon, date: new Date() },
        });
        store.dispatch({
          type: "SET_WEEK_FORECAST",
          payload: w.daily
            .slice(0, 7)
            .map((x) => ({ icon: x.weather[0].id, temp: (x.temp.min + x.temp.max) / 2 })),
        });
      })();
    }
  }, [location]);

  const todaysTemps = ["morning", "day", "evening", "night"].map((x) => ({
    title: x,
    temp: todayForecast[x],
  }));

  return todayForecast && weekForecast && location ? (
    <div className="p-10 p-md-20 p-lg-30 page-container">
      <div className="d-flex justify-space-between align-center mb-40">
        <div className="d-flex align-center font-w-700 font-40">
          <MdArrowBack className="mr-10" onClick={getBack}></MdArrowBack>
          <div>{location.address.split(",")[0]}</div>
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{ position: "absolute", width: "100%", height: "100%", padding: "0 20px" }}
            className="d-flex justify-space-between align-center font-w-700"
          >
            <div>°C</div>
            <div>°F</div>
          </div>
          <Flipper
            flipKey={isCelcius}
            className={`units-toggle-btn-container d-flex align-center ${
              isCelcius ? "justify-flex-end" : "justify-flex-start"
            }`}
          >
            <Flipped flipId="toggle">
              <div
                className="units-toggle-btn"
                onClick={() => store.dispatch({ type: "CHANGE_UNITS" })}
              ></div>
            </Flipped>
          </Flipper>
        </div>
      </div>
      <div className="font-md-32 font-w-300 mb-20">
        {moment().format("dddd, MMMM D")}
        {getOrdinalEnding(new Date().getDate())} {moment().format("YYYY")}
      </div>
      <div className="font-md-26 font-w-300 mb-20">
        {todayForecast.nowIcon ? capitalize(weatherIconsMappings[todayForecast.nowIcon].label) : ""}
      </div>
      <div className="d-flex text-colored align-center mb-40">
        <div className="font-100 font-w-500 mr-50">
          {isCelcius
            ? todayForecast.now.toFixed(0)
            : convertCelciusToFarenheit(todayForecast.now).toFixed(0)}
          {isCelcius ? "°C" : "°F"}
        </div>
        <i className={getIconClass(todayForecast.nowIcon) + " font-100 mr-50"}></i>
        <div style={{ width: 160 }} className="font-24 font-w-300">
          {todaysTemps.map((x, i) => (
            <div key={`todays-temp-${i}`} className="d-flex justify-space-between">
              <div>{x.title}</div>
              <div>
                {isCelcius ? x.temp.toFixed(0) : convertCelciusToFarenheit(x.temp).toFixed(0)}
                {isCelcius ? "°C" : "°F"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row">
        {weekForecast.map((x, i) => (
          <div
            key={`daily-forecast-${i}`}
            className="col d-flex justify-center"
            style={{ textAlign: "center" }}
          >
            <div>
              <div className="mb-20">Day</div>
              <i className={getIconClass(x.icon, true) + " font-40 mb-20"}></i>
              <div>
                {isCelcius ? x.temp.toFixed(0) : convertCelciusToFarenheit(x.temp).toFixed(0)}
                {isCelcius ? "°C" : "°F"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

function mapp(state, ownProps) {
  return {
    todayForecast: state.todayForecast,
    weekForecast: state.weekForecast,
    isCelcius: state.isCelcius,
    ...ownProps,
  };
}

export default connect(mapp)(CityForecastsPage);
