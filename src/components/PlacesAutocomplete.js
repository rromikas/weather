import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useState } from "react";
import { MdSearch } from "react-icons/md";

const LocationSearchInput = ({ setLocation }) => {
  const [address, setAddress] = useState("");

  const handleChange = (value) => {
    setAddress(value);
  };

  const handleSelect = (value) => {
    geocodeByAddress(value)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setLocation({ ...latLng, address: value });
      })
      .catch((error) => console.error("Error", error));
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
            {suggestions.map((suggestion) => {
              const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
              return (
                <div
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
