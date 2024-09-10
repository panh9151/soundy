import React, { useState, useRef, useCallback } from "react";
import YouTube from "react-youtube";
import classes from "./YoutubePiP.module.scss";
import clsx from "clsx";
import { ReactSVG } from "react-svg";

const YouTubePiP = ({ active }: any) => {
  const [linkType, setLinkType] = useState("video"); // 'video' hoặc 'playlist'
  const [id, setId] = useState("");
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [input, setInput] = useState("");
  const videoRef = useRef<any>(null);
  const [isHidePiP, setIsHidePiP] = useState(false);
  const [position, setPosition] = useState({ bottom: 20, right: 72 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Hàm để lấy ID video từ link YouTube
  const extractVideoId = (url: any) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)|(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] || match[2] : null;
  };

  // Hàm để lấy ID playlist từ link YouTube
  const extractPlaylistId = (url: any) => {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Xử lý khi người dùng nhập link và submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const url = e.target.youtubeLink.value;
    if (linkType === "video") {
      const videoId = extractVideoId(url);
      if (videoId) {
        setId(videoId);
      }
    } else if (linkType === "playlist") {
      const playlistId = extractPlaylistId(url);
      if (playlistId) {
        setId(playlistId);
      }
    }
  };

  // Hàm bật chế độ PiP
  const handlePiP = () => {
    if (videoRef.current && videoRef.current.internalPlayer) {
      const videoElement = videoRef.current.internalPlayer.getIframe();
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        videoElement
          .requestPictureInPicture()
          .then(() => {
            setIsPiPActive(true);
          })
          .catch((error: any) => {
            console.error("PiP error: ", error);
          });
      }
    }
  };

  const changeLabelHandle = (value: string) => {
    setId("");
    setLinkType(value);
  };

  const handleToggleHideButton = () => {
    setIsHidePiP((prev) => !prev);
  };

  const handleToggleCloseButton = () => {
    setId("");
  };

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - (window.innerWidth - position.right),
      y: e.clientY - (window.innerHeight - position.bottom),
    });
  };

  const handleMouseMove = useCallback(
    (e: any) => {
      if (isDragging) {
        const newRight = window.innerWidth - (e.clientX - offset.x);
        const newBottom = window.innerHeight - (e.clientY - offset.y);

        // Ensure the button stays within the viewport
        const buttonWidth = 146; // Adjust according to your button's width
        const buttonHeight = 52; // Adjust according to your button's height

        setPosition({
          right: Math.max(
            0,
            Math.min(newRight, window.innerWidth - buttonWidth)
          ),
          bottom: Math.max(
            0,
            Math.min(newBottom, window.innerHeight - buttonHeight)
          ),
        });
        document.body.style.cursor = "grabbing";
      }
    },
    [isDragging, offset]
  );

  const handleMouseUp = () => {
    document.body.style.cursor = "default";
    setIsDragging(false);
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  const opts = {
    height: isHidePiP ? "0" : "180",
    width: isHidePiP ? "0" : "320",
    playerVars:
      linkType === "video"
        ? {
            autoplay: 1,
          }
        : {
            listType: "playlist",
            list: id,
            autoplay: 1,
          },
  };

  return (
    <>
      {active && (
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.heading}>Embed Youtube</div>
          <div className={classes.labelGroup}>
            <label
              className={clsx(classes.label, {
                [classes.label__active]: linkType === "video",
              })}
            >
              <input
                type="radio"
                name="linkType"
                value="video"
                checked={linkType === "video"}
                onChange={() => changeLabelHandle("video")}
                hidden
              />
              Video
            </label>
            <label
              className={clsx(classes.label, {
                [classes.label__active]: linkType === "playlist",
              })}
            >
              <input
                type="radio"
                name="linkType"
                value="playlist"
                checked={linkType === "playlist"}
                onChange={() => changeLabelHandle("playlist")}
                hidden
              />
              Playlist
            </label>
          </div>
          <textarea
            // type="text"
            className={classes.input}
            name="youtubeLink"
            placeholder={`Paste YouTube ${
              linkType === "video" ? "video" : "playlist"
            } link`}
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className={classes.button} disabled={!input}>
            Add {linkType === "video" ? "video" : "playlist"}
          </button>
        </form>
      )}
      <div
        className={classes.youtubeWrapper}
        style={{
          position: "absolute",
          bottom: `${position.bottom}px`,
          right: `${position.right}px`,
          width: "116px", // Ensure the width matches the width used in calculations
          height: "42px", // Ensure the height matches the height used in calculations
        }}
      >
        {id && (
          <>
            <div className={classes.buttonWrapper}>
              <button
                className={clsx(classes.button, {
                  [classes.drag]: true,
                  [classes.isDragging]: isDragging,
                })}
                onMouseDown={handleMouseDown}
              >
                <ReactSVG src="/icons/move.svg"></ReactSVG>
              </button>
              <button
                className={clsx(classes.button, {
                  [classes.notDragging]: isDragging,
                })}
                onClick={handleToggleHideButton}
              >
                {isHidePiP ? (
                  <ReactSVG src="/icons/minus.svg"></ReactSVG>
                ) : (
                  <ReactSVG src="/icons/plus.svg"></ReactSVG>
                )}
              </button>
              <button
                className={clsx(classes.button, {
                  [classes.notDragging]: isDragging,
                })}
                onClick={handleToggleCloseButton}
              >
                <ReactSVG src="/icons/close.svg"></ReactSVG>
              </button>
            </div>
            <YouTube
              videoId={linkType === "video" ? id : undefined}
              opts={opts}
              ref={videoRef}
            />
          </>
        )}
      </div>
    </>
  );
};

export default YouTubePiP;
