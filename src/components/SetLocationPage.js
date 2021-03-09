import PlacesAutocomplete from "components/PlacesAutocomplete";

export const RequestGeolocation = (setLocation) => {
  function onLocationError(er) {
    alert("No access to user location: " + er.message);
  }
  if (!navigator.geolocation) {
    alert("Browser doesn't support geolocation detector");
  } else {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&result_type=locality|country&key=AIzaSyDmQAyt3ke92M1CYujRXDObR2GQ82ehYJU`
        ).then((x) => x.json());
        if (res.results[0]?.formatted_address) {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: res.results[0].formatted_address,
          });
        }
      },
      onLocationError,
      {
        enableHighAccuracy: true,
      }
    );
  }
};

const SetLocationPage = ({ setLocation }) => {
  return (
    <div className="p-10 p-md-20 p-lg-30 page-container d-flex">
      <div
        className="ml-auto mt-auto mr-auto mb-auto"
        style={{ maxWidth: 470, width: "100%", textAlign: "center" }}
      >
        <PlacesAutocomplete setLocation={setLocation}></PlacesAutocomplete>
        <div className="pt-30 pb-30">or</div>
        <div className="font-20">
          use my{" "}
          <span
            style={{
              borderBottom: "1px dashed",
              cursor: "pointer",
            }}
            onClick={() => RequestGeolocation(setLocation)}
          >
            current position
          </span>
        </div>
      </div>
    </div>
  );
};

export default SetLocationPage;
