import "icons/css/weather-icons.css";
import "styles/index.css";
import { useState, useEffect } from "react";
import SetLocationPage from "components/SetLocationPage";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "store";
import { Provider, connect } from "react-redux";
import CityForecastsPage from "components/CityForecastsPage";
import Loader from "components/Loader";

const App = ({ location }) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(location ? 1 : 0);
  }, [location]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app-container">
          {page === 0 ? (
            <SetLocationPage></SetLocationPage>
          ) : page === 1 ? (
            <CityForecastsPage></CityForecastsPage>
          ) : null}
        </div>
        <Loader></Loader>
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
