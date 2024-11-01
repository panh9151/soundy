import { useContext, useEffect, useRef } from "react";
import classes from "./Background.module.scss";
import Audio from "../Audio";
import { AppContext } from "@/app/layout";
import clsx from "clsx";

const Background = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const dayRef = useRef<HTMLVideoElement>(null);
  const nightRef = useRef<HTMLVideoElement>(null);
  const dayRainRef = useRef<HTMLVideoElement>(null);
  const nightRainRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (dayRef.current) {
      dayRef.current.load();
    }
    if (nightRef.current) {
      nightRef.current.load();
    }
    if (dayRainRef.current) {
      dayRainRef.current.load();
    }
    if (nightRainRef.current) {
      nightRainRef.current.load();
    }
  }, [
    state?.currentScenario?.day_url,
    state?.currentScenario?.night_url,
    state?.currentScenario?.rain_day_url,
    state?.currentScenario?.rain_night_url,
  ]);

  return (
    <>
      {/* <button onClick={() => toggleTimeHanddle()}>Toggle Time</button>
      <button onClick={() => toggleWeatherHanddle()}>Toggle Rain</button> */}
      <div className={classes.backgroundContainer}>
        {!state.loadingBackground ? (
          <>
            {state?.currentScenario?.day_url && (
              <video
                ref={dayRef}
                preload="auto"
                muted
                loop
                autoPlay
                width="100%"
                className={clsx(classes.backgroundVideo, {
                  [classes.backgroundVideo__active]:
                    state.currentStateScenario.time === "day" &&
                    state.currentStateScenario.weather === "clear",
                })}
              >
                <source
                  src={clsx(state.currentScenario.day_url)}
                  type="video/mp4"
                />
                <track
                  src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            )}
            {state?.currentScenario?.night_url && (
              <video
                ref={nightRef}
                preload="auto"
                muted
                loop
                autoPlay
                width="100%"
                className={clsx(classes.backgroundVideo, {
                  [classes.backgroundVideo__active]:
                    state.currentStateScenario.time === "night" &&
                    state.currentStateScenario.weather === "clear",
                })}
              >
                <source
                  src={clsx(state.currentScenario.night_url)}
                  type="video/mp4"
                />
                <track
                  src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            )}
            {state?.currentScenario?.rain_day_url && (
              <video
                ref={dayRainRef}
                preload="auto"
                muted
                loop
                autoPlay
                width="100%"
                className={clsx(classes.backgroundVideo, {
                  [classes.backgroundVideo__active]:
                    state.currentStateScenario.time === "day" &&
                    state.currentStateScenario.weather === "rainy",
                })}
              >
                <source
                  src={clsx(state.currentScenario.rain_day_url)}
                  type="video/mp4"
                />
                <track
                  src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            )}
            {state?.currentScenario?.rain_night_url && (
              <video
                ref={nightRainRef}
                preload="auto"
                muted
                loop
                autoPlay
                width="100%"
                className={clsx(classes.backgroundVideo, {
                  [classes.backgroundVideo__active]:
                    state.currentStateScenario.time === "night" &&
                    state.currentStateScenario.weather === "rainy",
                })}
              >
                <source
                  src={clsx(state?.currentScenario?.rain_night_url)}
                  type="video/mp4"
                />
                <track
                  src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        ) : (
          <p>Loading video...</p>
        )}
        <Audio />
      </div>
    </>
  );
};

export default Background;
