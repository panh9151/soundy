import classes from "./Background.module.scss";

const Background = ({ url }: { url: string }): JSX.Element => {
  const wrapperStyle = { "--url": `url(${url})` } as React.CSSProperties; // Cast to React.CSSProperties to allow custom CSS variables
  return (
    <div className={classes.backgroundContainer}>
      <video preload="auto" width="100%" muted loop autoPlay>
        <source
          src={url}
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
    </div>
  );
};

export default Background;
