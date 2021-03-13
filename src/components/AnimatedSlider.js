import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { getIconClass, convertCelciusToFarenheit } from "helpers";

const AnimatedSlider = ({ weekForecast, isCelcius }) => {
  const slider = useRef(null);
  const sliderAnimationTurnedOff = useRef(false);
  const [counter, setCounter] = useState(0);

  const turnOffSliderAnimation = () => {
    sliderAnimationTurnedOff.current = true;
  };

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      if (!sliderAnimationTurnedOff.current && slider.current) {
        slider.current.scrollLeft += counter > 600 ? -1 : 1;
      }
      setCounter(counter < 1200 ? counter + 1 : 0);
    }, 30);

    return () => {
      clearTimeout(timeout);
    };
  }, [counter]);

  const weekdays = moment.weekdays();
  const weekdayIndex = moment.unix(weekForecast[0].date).day();

  return (
    <div
      onTouchStart={turnOffSliderAnimation}
      onMouseDown={turnOffSliderAnimation}
      ref={slider}
      className="mb-30"
      style={{ maxWidth: "100%", overflow: "auto", paddingBottom: 10, scrollBehavior: "smooth" }}
    >
      <div className="row pl-20 pl-sm-30 pr-20 pr-sm-30" style={{ minWidth: 710 }}>
        {weekForecast.map((x, i) => (
          <div
            key={`daily-forecast-${i}`}
            className="col d-flex justify-center"
            style={{ textAlign: "center" }}
          >
            <div>
              <div className="mb-20">{weekdays[(weekdayIndex + i) % 7]}</div>
              <i className={getIconClass(x.icon, x.dayTime, true) + " font-40 mb-20"}></i>
              <div>
                {isCelcius
                  ? Math.round(x.temp)
                  : Math.round(convertCelciusToFarenheit(Math.round(x.temp)))}
                {isCelcius ? "°C" : "°F"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSlider;
