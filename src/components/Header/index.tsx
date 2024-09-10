import { ReactSVG } from "react-svg";
import classes from "./Header.module.scss";
import { useContext, useEffect, useState } from "react";
import SwitchButtonCustom from "../SwitchButtonCustom";
import { AppContext } from "@/app/layout";
import clsx from "clsx";
import Link from "next/link";

const Header = () => {
  const { state, dispatch } = useContext(AppContext);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpandMenu, setIsExpandMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFullscreen = () => {
    const elem = document.documentElement; // Toàn bộ trang web
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      // Firefox
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      // IE/Edge
      (elem as any).msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Chrome, Safari and Opera
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleTimeHanddle = () => {
    dispatch({
      type: "CURRENT_STATE_SCENARIO",
      payload: {
        ...state.currentStateScenario,
        time: state.currentStateScenario.time === "day" ? "night" : "day",
      },
    });
  };

  const toggleWeatherHanddle = () => {
    console.log(state.currentStateScenario.weather);

    dispatch({
      type: "CURRENT_STATE_SCENARIO",
      payload: {
        ...state.currentStateScenario,
        weather:
          state.currentStateScenario.weather === "rainy" ? "clear" : "rainy",
      },
    });
  };

  const togglePlayMusic = () => {
    dispatch({
      type: "PLAYING_MUSIC",
      payload: { ...state.playingMusic, isPlay: !state.playingMusic.isPlay },
    });
  };

  const handleChangeMusic = (music: any) => {
    dispatch({
      type: "PLAYING_MUSIC",
      payload: {
        author: music.author,
        createdAt: music.created_at,
        id: music.id_music,
        isPlay: true,
        lastUpdate: music.last_updated,
        path: music.music_path,
        title: music.title,
        type: music.type,
        volumn:
          (typeof state.playingMusic.volumn === "number" &&
            state.playingMusic.volumn) ||
          0,
      },
    });
  };

  const handleOnClickNextBtn = () => {
    // Get new index
    let newIndex;
    const currentIndex = state.musicList.findIndex(
      (item: any) => item.id_music === state.playingMusic.id
    );
    if (currentIndex + 1 < state.musicList.length) {
      newIndex = currentIndex + 1;
    } else {
      newIndex = 0;
    }

    const music = state.musicList[newIndex];
    dispatch({
      type: "PLAYING_MUSIC",
      payload: {
        author: music.author,
        createdAt: music.created_at,
        id: music.id_music,
        isPlay: true,
        lastUpdate: music.last_updated,
        path: music.music_path,
        title: music.title,
        type: music.type,
        volumn:
          (typeof state.playingMusic.volumn === "number" &&
            state.playingMusic.volumn) ||
          0,
      },
    });
  };
  const handleOnClickPreviousBtn = () => {
    let newIndex;
    const currentIndex = state.musicList.findIndex(
      (item: any) => item.id_music === state.playingMusic.id
    );
    if (currentIndex > 1) {
      newIndex = currentIndex - 1;
    } else {
      newIndex = state.musicList.length - 1;
    }

    const music = state.musicList[newIndex];
    dispatch({
      type: "PLAYING_MUSIC",
      payload: {
        author: music.author,
        createdAt: music.created_at,
        id: music.id_music,
        isPlay: true,
        lastUpdate: music.last_updated,
        path: music.music_path,
        title: music.title,
        type: music.type,
        volumn:
          (typeof state.playingMusic.volumn === "number" &&
            state.playingMusic.volumn) ||
          0,
      },
    });
  };

  return (
    <div className={classes.header}>
      <div className={classes.logo}>
        <img src="/logo.gif" alt="" />
      </div>
      <div className={classes.rightWrapper}>
        <SwitchButtonCustom
          id="switch-time-btn"
          value={state.currentStateScenario.time === "day"}
          onchange={toggleTimeHanddle}
          leftIcon={
            <ReactSVG src="/icons/fluent_weather-sunny-28-filled.svg"></ReactSVG>
          }
          rightIcon={
            <ReactSVG src="/icons/fluent_weather-moon-28-filled.svg"></ReactSVG>
          }
          rightBackground="rgba(var(--primary-color-rgb)"
          leftBackground="#121212"
        />
        <SwitchButtonCustom
          id="switch-weather-btn"
          value={state.currentStateScenario.weather === "clear"}
          onchange={toggleWeatherHanddle}
          leftIcon={
            <ReactSVG src="/icons/fluent_cloud-16-filled.svg"></ReactSVG>
          }
          rightIcon={
            <ReactSVG src="/icons/fluent_weather-rain-20-filled.svg"></ReactSVG>
          }
          rightBackground="#4da1d1"
          leftBackground="rgba(18, 22, 112, .7)"
        />

        {/* <SwitchButtonCustom
          type="multi"
          itemList={[
            { icon: "123", background: "blue" },
            { icon: "234", background: "yellow" },
            { icon: "345", background: "red" },
            { icon: "456", background: "gray" },
          ]}
        /> */}
        <div className={classes.timeLabel}>
          {currentTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
        <div className={classes.musicGroup}>
          <div className={classes.button} onClick={handleOnClickPreviousBtn}>
            <ReactSVG src="/icons/fluent_previous-20-filled.svg"></ReactSVG>
          </div>
          <div className={classes.button} onClick={togglePlayMusic}>
            {state.playingMusic.isPlay ? (
              <ReactSVG src="/icons/fluent_pause-28-filled.svg"></ReactSVG>
            ) : (
              <ReactSVG src="/icons/fluent_play-28-filled.svg"></ReactSVG>
            )}
          </div>
          <div className={classes.button} onClick={handleOnClickNextBtn}>
            <ReactSVG src="/icons/fluent_next-24-filled.svg"></ReactSVG>
          </div>
          <div className={classes.button}>
            <ReactSVG src="/icons/fluent_speaker-2-28-filled.svg"></ReactSVG>
          </div>
        </div>
        <div>
          <button
            className={classes.button}
            onClick={() => {
              if (!isFullscreen) handleFullscreen();
              else handleExitFullscreen();
            }}
          >
            <ReactSVG src="/icons/fullscreen.svg" className={classes.img} />
          </button>
        </div>
        {/* <button className={classes.loginBtn}>
          <img
            className={classes.defaultAvatar}
            src="/icons/default_avatar.png"
            alt=""
          />
          <span className={classes.title}>Login</span>
        </button> */}
        {isExpandMenu && (
          <div
            className={classes.layer}
            onClick={() => setIsExpandMenu(false)}
          ></div>
        )}
        <div className={classes.menuWrapper}>
          <div
            className={classes.button}
            onClick={() => setIsExpandMenu((prev) => !prev)}
          >
            <ReactSVG src="/icons/menu.svg"></ReactSVG>
          </div>
          <ul
            className={clsx(classes.ul, { [classes.ul__expand]: isExpandMenu })}
          >
            <li className={classes.li}>
              <Link href="/admin">Admin</Link>
            </li>
            <li className={classes.li}>
              <Link href="/login">Login</Link>
            </li>
            <li className={classes.li}>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li className={classes.li}>
              <Link href="/how-it-work">How it work</Link>
            </li>
            <li className={classes.li}>
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li className={classes.li}>
              <Link href="/share-feedback">Share Feedback</Link>
            </li>
            <li className={classes.li}>
              <Link href="/general-setting">General Setting</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
