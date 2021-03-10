import { connect } from "react-redux";
import { useEffect, useState } from "react";
import LoaderSVG from "assets/loader.svg";

const Loader = ({ loading }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setAnimate(true);
      }, 20);
    } else {
      if (animate) {
        timeout = setTimeout(() => {
          setAnimate(false);
        }, 20);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      className="loader"
      style={{
        zIndex: loading ? 100 : -1,
        background: animate && loading ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0)",
      }}
    >
      {animate && loading ? <img alt="loading..." width={140} src={LoaderSVG}></img> : null}
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    loading: state.loading,
    ...ownProps,
  };
}

export default connect(mapp)(Loader);
