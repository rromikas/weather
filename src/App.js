import "icons/css/weather-icons.css";
import "styles/index.css";
import { useState, useEffect } from "react";
import SetLocationPage from "components/SetLocationPage";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "store";
import { Provider, connect } from "react-redux";
import { Flipper } from "react-flip-toolkit";
import CityForecastsPage from "components/CityForecastsPage";

const App = ({ location }) => {
  const setLocation = (value) => store.dispatch({ type: "SET_LOCATION", payload: value });
  const [page, setPage] = useState(0);

  useEffect(() => {
    store.dispatch({
      type: "SET_TODAY_FORECAST",
      payload: null,
    });
    store.dispatch({
      type: "SET_WEEK_FORECAST",
      payload: null,
    });
    store.dispatch({ type: "SET_LOCATION", payload: null });
  }, []);

  useEffect(() => {
    // setPage(location ? 1 : 0);
  }, [location]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Flipper className="app-container">
          {page === 0 ? (
            <SetLocationPage setLocation={setLocation}></SetLocationPage>
          ) : page === 1 ? (
            <CityForecastsPage location={location}></CityForecastsPage>
          ) : null}
        </Flipper>
      </PersistGate>
    </Provider>
  );
};

function mapp(state, ownProps) {
  return {
    location: state.location,
    ...ownProps,
  };
}

const ConnectedApp = connect(mapp)(App);

const StatefulApp = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedApp></ConnectedApp>
      </PersistGate>
    </Provider>
  );
};

export default StatefulApp;
