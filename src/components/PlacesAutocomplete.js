import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { store } from "store";

const LocationSearchInput = () => {
  const [address, setAddress] = useState("");

  const setLocation = (value) => store.dispatch({ type: "SET_LOCATION", payload: value });

  const handleChange = (value) => {
    setAddress(value);
  };

  const handleSelect = (value) => {
    let selectedCity = "";
    store.dispatch({ type: "SET_LOADING", payload: true });
    geocodeByAddress(value)
      .then((results) => {
        selectedCity = results[0].address_components.find((x) => x.types.includes("locality"))
          .long_name;
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        setLocation({ ...latLng, address: selectedCity });
        store.dispatch({ type: "SET_LOADING", payload: false });
      })
      .catch((error) => {
        console.error("Error", error);
        store.dispatch({ type: "SET_LOADING", payload: false });
      });
  };

  return (
    <PlacesAutocomplete
      searchOptions={{ types: ["(cities)"] }}
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ position: "relative" }}>
          <input
            spellCheck={false}
            {...getInputProps({
              placeholder: "City",
              className: "location-search-input font-w-500",
            })}
          />
          <MdSearch
            size={32}
            style={{ position: "absolute", right: 10, top: 0, bottom: 0, margin: "auto" }}
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
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
