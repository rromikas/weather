import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

function todaysForecastReducer(state = null, action) {
  switch (action.type) {
    case "SET_TODAY_FORECAST":
      return action.payload;
    default:
      return state;
  }
}

function weekForecastReducer(state = null, action) {
  switch (action.type) {
    case "SET_WEEK_FORECAST":
      return action.payload;
    default:
      return state;
  }
}

function locationReducer(state = null, action) {
  switch (action.type) {
    case "SET_LOCATION":
      return action.payload;
    default:
      return state;
  }
}
function isCelciusReducer(state = true, action) {
  switch (action.type) {
    case "CHANGE_UNITS":
      return !state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  todayForecast: todaysForecastReducer,
  weekForecast: weekForecastReducer,
  location: locationReducer,
  isCelcius: isCelciusReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
