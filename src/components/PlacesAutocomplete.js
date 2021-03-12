import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { store } from "store";

const LocationSearchInput = () => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const setLocation = (value) => store.dispatch({ type: "SET_LOCATION", payload: value });

  const handleChange = (value) => {
    setError(null);
    setAddress(value);
  };

  const handleSelect = async (value) => {
    store.dispatch({ type: "SET_LOADING", payload: true });

    let places = await (function getPlaces() {
      return new Promise((resolve, reject) => {
        new window.google.maps.places.AutocompleteService().getPlacePredictions(
          {
            input: value,
          },
          resolve
        );
      });
    })();

    if (!places.error) {
      let realPlace = places.find((x) => x.description === value);
      if (!realPlace) {
        realPlace = places.find((x) =>
          x.description
            .split(", ")
            .map((x) => x.toLowerCase())
            .includes(value.toLowerCase())
        );
      }

      if (realPlace) {
        geocodeByAddress(value)
          .then((results) => {
            return getLatLng(results[0]);
          })
          .then((latLng) => {
            setLocation({ ...latLng, address: realPlace.description.split(",")[0] });
            store.dispatch({ type: "SET_LOADING", payload: false });
          })
          .catch((error) => {
            console.error("Error", error);
            store.dispatch({ type: "SET_LOADING", payload: false });
          });
      } else {
        setError("City not found");
        store.dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      setError("Api related error");
      store.dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <PlacesAutocomplete
      searchOptions={{ types: ["(cities)"] }}
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, loading, suggestions, getSuggestionItemProps }) => {
        return (
          <div style={{ position: "relative" }}>
            <input
              spellCheck={false}
              {...getInputProps({
                placeholder: "City",
                className: "location-search-input font-w-500",
              })}
            />
            <MdSearch
              onClick={() => {
                handleSelect(address);
              }}
              size={32}
              style={{
                position: "absolute",
                right: 10,
                top: 0,
                bottom: 0,
                margin: "auto",
                cursor: "pointer",
              }}
            ></MdSearch>
            <div className="autocomplete-dropdown-container">
              {loading && <div className="pt-10 pb-10">Loading...</div>}
              {suggestions.map((suggestion, i) => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                return (
                  <div
                    key={`place-option-${i}`}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      onClick: () => {
                        handleChange(suggestion.description);
                      },
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                color: "#fe756d",
                paddingTop: 5,
              }}
            >
              {error ? error : ""}
            </div>
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
