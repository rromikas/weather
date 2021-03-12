import { MdArrowBack } from "react-icons/md";
import { store } from "store";
import { connect } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import weatherIconsMappings from "icons/mappings.json";
import { capitalize, getIconClass, convertCelciusToFarenheit, getOrdinalEnding } from "helpers";
import AnimatedSlider from "components/AnimatedSlider";

const CityForecastsPage = ({ location, weekForecast, todayForecast, isCelcius }) => {
  const getBack = () => {
    store.dispatch({ type: "SET_LOCATION", payload: null });
    store.dispatch({ type: "SET_TODAY_FORECAST", payload: null });
    store.dispatch({ type: "SET_WEEK_FORECAST", payload: null });
  };

  useEffect(() => {
    if (location) {
      (async function getForecasts() {
        let data = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,hourly,alerts&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        ).then((x) => x.json());

        const { morn, day, eve, night } = data.daily[0].temp;
        const now = data.current.temp;
        const nowIcon = data.current.weather[0].id;
        const dayTime =
          data.current.dt > data.current.sunset || data.current.dt < data.current.sunrise
            ? "night"
            : "day";
        store.dispatch({
          type: "SET_TODAY_FORECAST",
          payload: {
            morning: morn,
            day,
            evening: eve,
            night,
            now,
            nowIcon,
            date: data.current.dt,
            dayTime,
          },
        });
        store.dispatch({
          type: "SET_WEEK_FORECAST",
          payload: data.daily.slice(0, 7).map((x) => ({
            icon: x.weather[0].id,
            temp: (x.temp.min + x.temp.max) / 2,
            date: x.dt,
          })),
        });
      })();
    }
  }, [location]);

  const todaysTemps = todayForecast
    ? ["morning", "day", "evening", "night"].map((x) => ({
        title: x,
        temp: todayForecast[x],
      }))
    : [];

  const mostRecentDate = todayForecast ? new Date(todayForecast.date * 1000) : new Date();

  return todayForecast && weekForecast && location ? (
    <div className="page-container">
      <div className="row justify-space-between align-center p-30">
        <div className="d-flex align-center font-w-700 font-sm-40 font-30 mb-10">
          <MdArrowBack
            className="mr-sm-30 mr-20"
            style={{ cursor: "pointer" }}
            onClick={getBack}
          ></MdArrowBack>
          <div className="pr-10">{location.address.split(",")[0]}</div>
        </div>
        <div style={{ position: "relative" }} className="mb-10">
          <div
            style={{ position: "absolute", width: "100%", height: "100%", padding: "0 20px" }}
            className="d-flex justify-space-between align-center font-w-700"
          >
            <div>°C</div>
            <div>°F</div>
          </div>
          <div className={`units-toggle-btn-container`}>
            <div
              className="units-toggle-btn"
              style={{ left: !isCelcius ? 1 : 52 }}
              onClick={() => store.dispatch({ type: "CHANGE_UNITS" })}
            ></div>
          </div>
        </div>
      </div>
      <div className="font-sm-32 font-24 font-w-300 pl-30 pr-30 mb-20">
        {moment(mostRecentDate).format("dddd, MMMM D")}
        {getOrdinalEnding(mostRecentDate.getDate())} {moment(mostRecentDate).format("YYYY")}
      </div>
      <div className="font-sm-26 font-18 font-w-300 mb-20 pl-30 pr-30">
        {todayForecast.nowIcon ? capitalize(weatherIconsMappings[todayForecast.nowIcon].label) : ""}
      </div>
      <div
        className="d-flex text-colored align-flex-start pl-30 pr-30"
        style={{ flexWrap: "wrap" }}
      >
        <div className="d-flex align-center mb-20">
          <div className="font-sm-100 font-70 font-w-500 mr-sm-50 mr-40">
            {isCelcius
              ? Math.round(todayForecast.now)
              : Math.round(convertCelciusToFarenheit(todayForecast.now))}
            {isCelcius ? "°C" : "°F"}
          </div>
          <i
            className={
              getIconClass(todayForecast.nowIcon, todayForecast.dayTime) +
              " font-sm-100 font-70 mr-sm-50"
            }
          ></i>
        </div>
        <div style={{ width: 160 }} className="font-24 font-w-300 mb-50">
          {todaysTemps.map((x, i) => (
            <div key={`todays-temp-${i}`} className="d-flex justify-space-between">
              <div>{x.title}</div>
              <div>
                {isCelcius ? Math.round(x.temp) : Math.round(convertCelciusToFarenheit(x.temp))}
                {isCelcius ? "°C" : "°F"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatedSlider weekForecast={weekForecast} isCelcius={isCelcius}></AnimatedSlider>
    </div>
  ) : null;
};

function mapp(state, ownProps) {
  return {
    todayForecast: state.todayForecast,
    weekForecast: state.weekForecast,
    isCelcius: state.isCelcius,
    location: state.location,
    ...ownProps,
  };
}

export default connect(mapp)(CityForecastsPage);
