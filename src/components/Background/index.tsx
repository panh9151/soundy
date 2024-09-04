import { useContext } from "react";
import classes from "./Background.module.scss";
import Audio from "../Audio";
import { AppContext } from "@/app/layout";

const Background = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div className={classes.backgroundContainer}>
      {state.currentScenario?.path ? (
        <video preload="auto" muted loop autoPlay width="100%">
          <source
            src={state.currentScenario.path}
            type="video/mp4"
            className={classes.backgroundVideo}
          />
          <track
            src="/path/to/captions.vtt"
            kind="subtitles"
            srcLang="en"
            label="English"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )}
      <Audio />
    </div>
  );
};

export default Background;
