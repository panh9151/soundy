import classes from "./SoundsSetting.module.scss";
import { useContext, useState } from "react";
import clsx from "clsx";
import { ReactSVG } from "react-svg";
import { AppContext } from "@/app/layout";
import CustomSlider from "../CustomSlider";
import allIcon from "../../../assets/images/all.svg";
import Image from "next/image";

const SoundSetting = ({ sounds }: any) => {
  const { state, dispatch } = useContext(AppContext);
  const [range, setRange] = useState(50);
  const [typeButton, setTypeButton] = useState("sound");

  const changeTypeButtonHandle = (value: string) => {
    setTypeButton(value);
    dispatch({ type: "CURRENT_TYPE_INDEX", payload: 0 });
  };

  const handleSoundVolumnChange = (index: number, value: number) => {
    console.log("Change volumn handle");
    console.log(
      state.soundList.filter((sound: any) => {
        return !state.currentScenarioSound
          .map((i: any) => i.id)
          .includes(sound.id_sound);
      })[index],
      index
    );

    if (index >= 0 && index < state.currentScenarioSound.length) {
      dispatch({
        type: "CURRENT_SCENARIO_SOUND",
        payload: state.currentScenarioSound.map(
          (sound: any, soundIndex: number) => {
            if (soundIndex === index) {
              return {
                ...sound,
                volumn: value,
                isPlay: value !== 0 ? true : false,
              };
            }

            return sound;
          }
        ),
      });
    } else {
      dispatch({
        type: "SOUND_LIST",
        payload: state.soundList
          .filter((sound: any) => {
            return !state.currentScenarioSound
              .map((i: any) => i.id)
              .includes(sound.id_sound);
          })
          .map((sound: any, soundIndex: number) => {
            if (soundIndex + state.currentScenarioSound.length === index) {
              return {
                ...sound,
                volumn: value,
                isPlay: value !== 0 ? true : false,
              };
            } else return sound;
          }),
      });
    }
  };

  const handleChangeMusicVolumn = (value: number) => {
    // if (value !== 0) {
    dispatch({
      type: "PLAYING_MUSIC",
      payload: {
        ...state.playingMusic,
        volumn: value,
        isPlay: true,
      },
    });
    // } else {
    //   dispatch({
    //     type: "PLAYING_MUSIC",
    //     payload: {
    //       ...state.playingMusic,
    //       volumn: value,
    //       isPlay: false,
    //     },
    //   });
    // }
  };

  const changeTypeHandle = (value: number) => {
    dispatch({ type: "CURRENT_TYPE_INDEX", payload: value });
  };

  const onClickMusicHandle = (music: any) => {
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
    <div className={classes.wrapper}>
      <div className={clsx("d-flex", classes.topWrapper)}>
        <div className={clsx("d-flex flex-column", classes.typeWrapper)}>
          <div className={clsx(classes.heading)}>
            <label htmlFor="">{typeButton}</label>
            {typeButton === "music" && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 17 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0001 0.749966C17 0.633136 16.9726 0.51794 16.9202 0.413563C16.8677 0.309185 16.7915 0.218512 16.6978 0.148772C16.6041 0.0790316 16.4953 0.0321532 16.3803 0.0118737C16.2652 -0.00840588 16.147 -0.00152562 16.0351 0.0319657L6.0351 3.03197C5.88057 3.0782 5.74507 3.17303 5.6487 3.30237C5.55232 3.43171 5.50021 3.58867 5.5001 3.74997V13.627C4.85139 13.1753 4.0689 12.9565 3.28001 13.0063C2.49112 13.056 1.74231 13.3713 1.15546 13.9009C0.568617 14.4305 0.178308 15.1431 0.0480783 15.9227C-0.0821519 16.7024 0.0553657 17.5031 0.438243 18.1947C0.821121 18.8862 1.42681 19.4278 2.1567 19.7312C2.8866 20.0346 3.69771 20.0821 4.45799 19.8658C5.21827 19.6495 5.88295 19.1822 6.34381 18.54C6.80468 17.8978 7.03458 17.1185 6.9961 16.329L7.0001 16.25V8.30797L15.5001 5.75797V11.628C14.8514 11.1763 14.0689 10.9575 13.28 11.0073C12.4911 11.057 11.7423 11.3723 11.1555 11.9019C10.5686 12.4315 10.1783 13.1441 10.0481 13.9237C9.91785 14.7034 10.0554 15.5041 10.4382 16.1957C10.8211 16.8872 11.4268 17.4288 12.1567 17.7322C12.8866 18.0356 13.6977 18.0831 14.458 17.8668C15.2183 17.6505 15.883 17.1832 16.3438 16.541C16.8047 15.8988 17.0346 15.1195 16.9961 14.33L17.0001 14.25V0.749966Z"
                  fill="black"
                ></path>
              </svg>
            )}
            {typeButton === "sound" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 0C9.2046 0 9.40081 0.063214 9.54548 0.175736C9.69015 0.288258 9.77143 0.44087 9.77143 0.6V13.4C9.77143 13.5591 9.69015 13.7117 9.54548 13.8243C9.40081 13.9368 9.2046 14 9 14C8.7954 14 8.59919 13.9368 8.45452 13.8243C8.30985 13.7117 8.22857 13.5591 8.22857 13.4V0.6C8.22857 0.44087 8.30985 0.288258 8.45452 0.175736C8.59919 0.063214 8.7954 0 9 0ZM4.88571 2.4C5.09031 2.4 5.28653 2.46321 5.4312 2.57574C5.57587 2.68826 5.65714 2.84087 5.65714 3V11C5.65714 11.1591 5.57587 11.3117 5.4312 11.4243C5.28653 11.5368 5.09031 11.6 4.88571 11.6C4.68112 11.6 4.4849 11.5368 4.34023 11.4243C4.19556 11.3117 4.11429 11.1591 4.11429 11V3C4.11429 2.84087 4.19556 2.68826 4.34023 2.57574C4.4849 2.46321 4.68112 2.4 4.88571 2.4ZM13.1143 2.4C13.3189 2.4 13.5151 2.46321 13.6598 2.57574C13.8044 2.68826 13.8857 2.84087 13.8857 3V11C13.8857 11.1591 13.8044 11.3117 13.6598 11.4243C13.5151 11.5368 13.3189 11.6 13.1143 11.6C12.9097 11.6 12.7135 11.5368 12.5688 11.4243C12.4241 11.3117 12.3429 11.1591 12.3429 11V3C12.3429 2.84087 12.4241 2.68826 12.5688 2.57574C12.7135 2.46321 12.9097 2.4 13.1143 2.4ZM0.771429 5.6C0.976024 5.6 1.17224 5.66321 1.31691 5.77574C1.46158 5.88826 1.54286 6.04087 1.54286 6.2V7.8C1.54286 7.95913 1.46158 8.11174 1.31691 8.22426C1.17224 8.33679 0.976024 8.4 0.771429 8.4C0.566833 8.4 0.370617 8.33679 0.225946 8.22426C0.0812752 8.11174 0 7.95913 0 7.8V6.2C0 6.04087 0.0812752 5.88826 0.225946 5.77574C0.370617 5.66321 0.566833 5.6 0.771429 5.6ZM17.2286 5.6C17.4332 5.6 17.6294 5.66321 17.7741 5.77574C17.9187 5.88826 18 6.04087 18 6.2V7.8C18 7.95913 17.9187 8.11174 17.7741 8.22426C17.6294 8.33679 17.4332 8.4 17.2286 8.4C17.024 8.4 16.8278 8.33679 16.6831 8.22426C16.5384 8.11174 16.4571 7.95913 16.4571 7.8V6.2C16.4571 6.04087 16.5384 5.88826 16.6831 5.77574C16.8278 5.66321 17.024 5.6 17.2286 5.6Z"
                  fill="black"
                />
              </svg>
            )}
          </div>
          <div className={classes.typeList}>
            {typeButton === "sound" && (
              <>
                <div
                  className={clsx(classes.typeItem, {
                    [classes.typeItem__active]: state.currentTypeIndex === 0,
                  })}
                  onClick={() => changeTypeHandle(0)}
                >
                  <div className={classes.icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="14"
                      viewBox="0 0 19 14"
                      fill="none"
                    >
                      <path
                        d="M4.54134 0H1.18134C0.872218 0 0.621338 0.25088 0.621338 0.56V3.92C0.621338 4.22912 0.872218 4.48 1.18134 4.48C1.49046 4.48 1.74134 4.22912 1.74134 3.92V1.12H4.54134C4.85046 1.12 5.10134 0.86912 5.10134 0.56C5.10134 0.25088 4.85046 0 4.54134 0ZM17.9813 9.52C17.6722 9.52 17.4213 9.77088 17.4213 10.08V12.88H14.6213C14.3122 12.88 14.0613 13.1309 14.0613 13.44C14.0613 13.7491 14.3122 14 14.6213 14H17.9813C18.2905 14 18.5413 13.7491 18.5413 13.44V10.08C18.5413 9.77088 18.2905 9.52 17.9813 9.52ZM4.54134 12.88H1.74134V10.08C1.74134 9.77088 1.49046 9.52 1.18134 9.52C0.872218 9.52 0.621338 9.77088 0.621338 10.08V13.44C0.621338 13.7491 0.872218 14 1.18134 14H4.54134C4.85046 14 5.10134 13.7491 5.10134 13.44C5.10134 13.1309 4.85046 12.88 4.54134 12.88ZM17.9813 0H14.6213C14.3122 0 14.0613 0.25088 14.0613 0.56C14.0613 0.86912 14.3122 1.12 14.6213 1.12H17.4213V3.92C17.4213 4.22912 17.6722 4.48 17.9813 4.48C18.2905 4.48 18.5413 4.22912 18.5413 3.92V0.56C18.5413 0.25088 18.2905 0 17.9813 0Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className={classes.iconLabel}>All types</div>
                </div>
                {state.soundType.map((type: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={clsx(classes.typeItem, {
                        [classes.typeItem__active]:
                          state.currentTypeIndex === index + 1,
                      })}
                      onClick={() => changeTypeHandle(index + 1)}
                    >
                      <div className={classes.icon}>
                        <ReactSVG src={type.thumbnail} />
                      </div>
                      <div className={classes.iconLabel}>{type.label}</div>
                    </div>
                  );
                })}
              </>
            )}
            {typeButton === "music" && (
              <>
                <div
                  className={clsx(classes.typeItem, {
                    [classes.typeItem__active]: state.currentTypeIndex === 0,
                  })}
                  onClick={() => changeTypeHandle(0)}
                >
                  <div className={classes.icon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="14"
                      viewBox="0 0 19 14"
                      fill="none"
                    >
                      <path
                        d="M4.54134 0H1.18134C0.872218 0 0.621338 0.25088 0.621338 0.56V3.92C0.621338 4.22912 0.872218 4.48 1.18134 4.48C1.49046 4.48 1.74134 4.22912 1.74134 3.92V1.12H4.54134C4.85046 1.12 5.10134 0.86912 5.10134 0.56C5.10134 0.25088 4.85046 0 4.54134 0ZM17.9813 9.52C17.6722 9.52 17.4213 9.77088 17.4213 10.08V12.88H14.6213C14.3122 12.88 14.0613 13.1309 14.0613 13.44C14.0613 13.7491 14.3122 14 14.6213 14H17.9813C18.2905 14 18.5413 13.7491 18.5413 13.44V10.08C18.5413 9.77088 18.2905 9.52 17.9813 9.52ZM4.54134 12.88H1.74134V10.08C1.74134 9.77088 1.49046 9.52 1.18134 9.52C0.872218 9.52 0.621338 9.77088 0.621338 10.08V13.44C0.621338 13.7491 0.872218 14 1.18134 14H4.54134C4.85046 14 5.10134 13.7491 5.10134 13.44C5.10134 13.1309 4.85046 12.88 4.54134 12.88ZM17.9813 0H14.6213C14.3122 0 14.0613 0.25088 14.0613 0.56C14.0613 0.86912 14.3122 1.12 14.6213 1.12H17.4213V3.92C17.4213 4.22912 17.6722 4.48 17.9813 4.48C18.2905 4.48 18.5413 4.22912 18.5413 3.92V0.56C18.5413 0.25088 18.2905 0 17.9813 0Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className={classes.iconLabel}>All types</div>
                </div>
                {state.musicType.map((type: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={clsx(classes.typeItem, {
                        [classes.typeItem__active]:
                          state.currentTypeIndex === index + 1,
                      })}
                      onClick={() => changeTypeHandle(index + 1)}
                    >
                      <div className={classes.icon}>
                        <ReactSVG src={type.thumbnail} />
                      </div>
                      <div className={classes.iconLabel}>{type.label}</div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className={classes.toggleTypeWrapper}>
          <button
            onClick={() => changeTypeButtonHandle("sound")}
            className={clsx({ [classes.active]: typeButton === "sound" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0C9.2046 0 9.40081 0.063214 9.54548 0.175736C9.69015 0.288258 9.77143 0.44087 9.77143 0.6V13.4C9.77143 13.5591 9.69015 13.7117 9.54548 13.8243C9.40081 13.9368 9.2046 14 9 14C8.7954 14 8.59919 13.9368 8.45452 13.8243C8.30985 13.7117 8.22857 13.5591 8.22857 13.4V0.6C8.22857 0.44087 8.30985 0.288258 8.45452 0.175736C8.59919 0.063214 8.7954 0 9 0ZM4.88571 2.4C5.09031 2.4 5.28653 2.46321 5.4312 2.57574C5.57587 2.68826 5.65714 2.84087 5.65714 3V11C5.65714 11.1591 5.57587 11.3117 5.4312 11.4243C5.28653 11.5368 5.09031 11.6 4.88571 11.6C4.68112 11.6 4.4849 11.5368 4.34023 11.4243C4.19556 11.3117 4.11429 11.1591 4.11429 11V3C4.11429 2.84087 4.19556 2.68826 4.34023 2.57574C4.4849 2.46321 4.68112 2.4 4.88571 2.4ZM13.1143 2.4C13.3189 2.4 13.5151 2.46321 13.6598 2.57574C13.8044 2.68826 13.8857 2.84087 13.8857 3V11C13.8857 11.1591 13.8044 11.3117 13.6598 11.4243C13.5151 11.5368 13.3189 11.6 13.1143 11.6C12.9097 11.6 12.7135 11.5368 12.5688 11.4243C12.4241 11.3117 12.3429 11.1591 12.3429 11V3C12.3429 2.84087 12.4241 2.68826 12.5688 2.57574C12.7135 2.46321 12.9097 2.4 13.1143 2.4ZM0.771429 5.6C0.976024 5.6 1.17224 5.66321 1.31691 5.77574C1.46158 5.88826 1.54286 6.04087 1.54286 6.2V7.8C1.54286 7.95913 1.46158 8.11174 1.31691 8.22426C1.17224 8.33679 0.976024 8.4 0.771429 8.4C0.566833 8.4 0.370617 8.33679 0.225946 8.22426C0.0812752 8.11174 0 7.95913 0 7.8V6.2C0 6.04087 0.0812752 5.88826 0.225946 5.77574C0.370617 5.66321 0.566833 5.6 0.771429 5.6ZM17.2286 5.6C17.4332 5.6 17.6294 5.66321 17.7741 5.77574C17.9187 5.88826 18 6.04087 18 6.2V7.8C18 7.95913 17.9187 8.11174 17.7741 8.22426C17.6294 8.33679 17.4332 8.4 17.2286 8.4C17.024 8.4 16.8278 8.33679 16.6831 8.22426C16.5384 8.11174 16.4571 7.95913 16.4571 7.8V6.2C16.4571 6.04087 16.5384 5.88826 16.6831 5.77574C16.8278 5.66321 17.024 5.6 17.2286 5.6Z"
                fill="black"
              />
            </svg>
            <div className={classes.title}>Sound</div>
          </button>
          <button
            onClick={() => changeTypeButtonHandle("music")}
            className={clsx({ [classes.active]: typeButton === "music" })}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.0001 0.749966C17 0.633136 16.9726 0.51794 16.9202 0.413563C16.8677 0.309185 16.7915 0.218512 16.6978 0.148772C16.6041 0.0790316 16.4953 0.0321532 16.3803 0.0118737C16.2652 -0.00840588 16.147 -0.00152562 16.0351 0.0319657L6.0351 3.03197C5.88057 3.0782 5.74507 3.17303 5.6487 3.30237C5.55232 3.43171 5.50021 3.58867 5.5001 3.74997V13.627C4.85139 13.1753 4.0689 12.9565 3.28001 13.0063C2.49112 13.056 1.74231 13.3713 1.15546 13.9009C0.568617 14.4305 0.178308 15.1431 0.0480783 15.9227C-0.0821519 16.7024 0.0553657 17.5031 0.438243 18.1947C0.821121 18.8862 1.42681 19.4278 2.1567 19.7312C2.8866 20.0346 3.69771 20.0821 4.45799 19.8658C5.21827 19.6495 5.88295 19.1822 6.34381 18.54C6.80468 17.8978 7.03458 17.1185 6.9961 16.329L7.0001 16.25V8.30797L15.5001 5.75797V11.628C14.8514 11.1763 14.0689 10.9575 13.28 11.0073C12.4911 11.057 11.7423 11.3723 11.1555 11.9019C10.5686 12.4315 10.1783 13.1441 10.0481 13.9237C9.91785 14.7034 10.0554 15.5041 10.4382 16.1957C10.8211 16.8872 11.4268 17.4288 12.1567 17.7322C12.8866 18.0356 13.6977 18.0831 14.458 17.8668C15.2183 17.6505 15.883 17.1832 16.3438 16.541C16.8047 15.8988 17.0346 15.1195 16.9961 14.33L17.0001 14.25V0.749966Z"
                fill="black"
              />
            </svg>
            <div className={classes.title}>Music</div>
          </button>
        </div>
      </div>
      <div className={classes.musicWrapper}>
        {state.playingMusic && (
          <div className={classes.music}>
            <div className={classes.icon}>
              {state.playingMusic?.type?.thumbnail && (
                <ReactSVG src={state.playingMusic.type.thumbnail}></ReactSVG>
              )}
            </div>
            <div
              className={clsx(
                "d-flex flex-column",
                classes.musicContentWrapper
              )}
            >
              {state.playingMusic.title && (
                <div className={classes.musicHeading}>
                  {state.playingMusic.title}
                  {state.playingMusic.author?.name ? (
                    <>{" - " + state.playingMusic.author?.name}</>
                  ) : (
                    <></>
                  )}
                </div>
              )}
              <div className={classes.musicTools}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                >
                  <path
                    d="M14.5 1.81405C14.5 0.720052 13.193 0.154052 12.395 0.902052L7.458 5.53205C7.13357 5.83605 6.7056 6.00516 6.261 6.00505H3.25C2.38805 6.00505 1.5614 6.34746 0.951903 6.95695C0.34241 7.56645 0 8.3931 0 9.25505V12.7471C0 13.609 0.34241 14.4357 0.951903 15.0451C1.5614 15.6546 2.38805 15.9971 3.25 15.9971H6.262C6.706 15.9971 7.134 16.1671 7.458 16.4701L12.395 21.0961C13.194 21.8441 14.5 21.2781 14.5 20.1841V1.81405ZM17.782 7.72105C17.641 7.58389 17.4518 7.50761 17.2551 7.50864C17.0584 7.50967 16.87 7.58793 16.7304 7.72655C16.5909 7.86518 16.5114 8.05307 16.5091 8.24976C16.5067 8.44644 16.5818 8.63616 16.718 8.77805L18.936 11.0131L16.721 13.2181C16.584 13.3592 16.5079 13.5485 16.5092 13.7451C16.5104 13.9418 16.5888 14.1301 16.7276 14.2695C16.8663 14.4089 17.0543 14.4882 17.2509 14.4904C17.4476 14.4926 17.6372 14.4174 17.779 14.2811L19.997 12.0731L22.222 14.2821C22.2909 14.3555 22.374 14.4142 22.4661 14.4548C22.5583 14.4955 22.6577 14.5171 22.7583 14.5185C22.859 14.5199 22.959 14.501 23.0522 14.4629C23.1454 14.4248 23.2301 14.3684 23.301 14.2969C23.3719 14.2254 23.4278 14.1404 23.4651 14.0469C23.5025 13.9534 23.5206 13.8533 23.5185 13.7526C23.5164 13.6519 23.494 13.5527 23.4526 13.4609C23.4113 13.369 23.3519 13.2864 23.278 13.2181L21.058 11.0131L23.282 8.77905C23.4224 8.63809 23.5011 8.44711 23.5007 8.24814C23.5004 8.04916 23.421 7.85848 23.28 7.71805C23.139 7.57762 22.9481 7.49894 22.7491 7.49931C22.5501 7.49969 22.3594 7.57909 22.219 7.72005L19.997 9.95205L17.782 7.72105Z"
                    fill="#FAA64B"
                  />
                </svg>
                <CustomSlider
                  value={state.playingMusic.volumn}
                  thumbColor="var(--primary-color)"
                  onChange={(e: any) =>
                    handleChangeMusicVolumn(Number(e.target.value))
                  }
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                >
                  <path
                    d="M12.395 0.902052C13.193 0.154052 14.5 0.720052 14.5 1.81405V20.1841C14.5 21.2781 13.194 21.8441 12.395 21.0961L7.458 16.4701C7.13382 16.1663 6.70625 15.9972 6.262 15.9971H3.25C2.38805 15.9971 1.5614 15.6546 0.951903 15.0451C0.34241 14.4357 0 13.609 0 12.7471V9.25505C0 8.3931 0.34241 7.56645 0.951903 6.95695C1.5614 6.34746 2.38805 6.00505 3.25 6.00505H6.261C6.706 6.00505 7.134 5.83505 7.458 5.53205L12.395 0.902052ZM19.644 2.18405C19.7934 2.05286 19.9887 1.98632 20.1871 1.99907C20.3855 2.01182 20.5707 2.10281 20.702 2.25205C22.8317 4.66806 24.0047 7.77936 24 11.0001C24 14.3521 22.754 17.4141 20.702 19.7471C20.638 19.8244 20.5591 19.8881 20.4701 19.9344C20.381 19.9807 20.2835 20.0087 20.1835 20.0166C20.0834 20.0245 19.9828 20.0123 19.8875 19.9806C19.7922 19.949 19.7043 19.8985 19.6289 19.8322C19.5535 19.7659 19.4922 19.6852 19.4486 19.5948C19.405 19.5043 19.38 19.4061 19.3751 19.3058C19.3701 19.2056 19.3854 19.1053 19.4199 19.0111C19.4544 18.9168 19.5075 18.8304 19.576 18.7571C21.4647 16.6149 22.5047 13.8559 22.5 11.0001C22.5047 8.14418 21.4647 5.3852 19.576 3.24305C19.5109 3.16907 19.461 3.08299 19.4292 2.98971C19.3973 2.89644 19.3842 2.79781 19.3905 2.69946C19.3968 2.60111 19.4225 2.50497 19.466 2.41653C19.5095 2.32809 19.57 2.24909 19.644 2.18405ZM18.353 5.30305C18.2939 5.22426 18.2199 5.15788 18.1351 5.1077C18.0504 5.05752 17.9566 5.02452 17.8591 5.01059C17.7616 4.99666 17.6623 5.00207 17.5669 5.02652C17.4715 5.05096 17.3818 5.09396 17.303 5.15305C17.2242 5.21215 17.1578 5.28618 17.1076 5.37093C17.0575 5.45568 17.0245 5.54948 17.0105 5.64699C16.9966 5.74449 17.002 5.84378 17.0265 5.93919C17.0509 6.0346 17.0939 6.12426 17.153 6.20305C18.1925 7.58601 18.7531 9.26999 18.75 11.0001C18.75 12.8001 18.156 14.4601 17.153 15.7971C17.0939 15.8758 17.0509 15.9655 17.0265 16.0609C17.002 16.1563 16.9966 16.2556 17.0105 16.3531C17.0245 16.4506 17.0575 16.5444 17.1076 16.6292C17.1578 16.7139 17.2242 16.788 17.303 16.8471C17.3818 16.9061 17.4715 16.9491 17.5669 16.9736C17.6623 16.998 17.7616 17.0034 17.8591 16.9895C17.9566 16.9756 18.0504 16.9426 18.1351 16.8924C18.2199 16.8422 18.2939 16.7758 18.353 16.6971C19.5872 15.0544 20.2531 13.0547 20.25 11.0001C20.2531 8.94544 19.5872 6.94566 18.353 5.30305Z"
                    fill="#FAA64B"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      {typeButton === "sound" && (
        <div className={classes.soundListWrapper}>
          <div className={classes.soundWrapper}>
            <div className={classes.heading}>
              <label htmlFor="">
                Sounds from <b>{state.currentScenario.name}</b>
              </label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 0C9.2046 0 9.40081 0.063214 9.54548 0.175736C9.69015 0.288258 9.77143 0.44087 9.77143 0.6V13.4C9.77143 13.5591 9.69015 13.7117 9.54548 13.8243C9.40081 13.9368 9.2046 14 9 14C8.7954 14 8.59919 13.9368 8.45452 13.8243C8.30985 13.7117 8.22857 13.5591 8.22857 13.4V0.6C8.22857 0.44087 8.30985 0.288258 8.45452 0.175736C8.59919 0.063214 8.7954 0 9 0ZM4.88571 2.4C5.09031 2.4 5.28653 2.46321 5.4312 2.57574C5.57587 2.68826 5.65714 2.84087 5.65714 3V11C5.65714 11.1591 5.57587 11.3117 5.4312 11.4243C5.28653 11.5368 5.09031 11.6 4.88571 11.6C4.68112 11.6 4.4849 11.5368 4.34023 11.4243C4.19556 11.3117 4.11429 11.1591 4.11429 11V3C4.11429 2.84087 4.19556 2.68826 4.34023 2.57574C4.4849 2.46321 4.68112 2.4 4.88571 2.4ZM13.1143 2.4C13.3189 2.4 13.5151 2.46321 13.6598 2.57574C13.8044 2.68826 13.8857 2.84087 13.8857 3V11C13.8857 11.1591 13.8044 11.3117 13.6598 11.4243C13.5151 11.5368 13.3189 11.6 13.1143 11.6C12.9097 11.6 12.7135 11.5368 12.5688 11.4243C12.4241 11.3117 12.3429 11.1591 12.3429 11V3C12.3429 2.84087 12.4241 2.68826 12.5688 2.57574C12.7135 2.46321 12.9097 2.4 13.1143 2.4ZM0.771429 5.6C0.976024 5.6 1.17224 5.66321 1.31691 5.77574C1.46158 5.88826 1.54286 6.04087 1.54286 6.2V7.8C1.54286 7.95913 1.46158 8.11174 1.31691 8.22426C1.17224 8.33679 0.976024 8.4 0.771429 8.4C0.566833 8.4 0.370617 8.33679 0.225946 8.22426C0.0812752 8.11174 0 7.95913 0 7.8V6.2C0 6.04087 0.0812752 5.88826 0.225946 5.77574C0.370617 5.66321 0.566833 5.6 0.771429 5.6ZM17.2286 5.6C17.4332 5.6 17.6294 5.66321 17.7741 5.77574C17.9187 5.88826 18 6.04087 18 6.2V7.8C18 7.95913 17.9187 8.11174 17.7741 8.22426C17.6294 8.33679 17.4332 8.4 17.2286 8.4C17.024 8.4 16.8278 8.33679 16.6831 8.22426C16.5384 8.11174 16.4571 7.95913 16.4571 7.8V6.2C16.4571 6.04087 16.5384 5.88826 16.6831 5.77574C16.8278 5.66321 17.024 5.6 17.2286 5.6Z"
                  fill="black"
                />
              </svg>
            </div>

            <div className={classes.soundList}>
              {state.currentScenarioSound.map((sound: any, index: number) => {
                return (
                  <div className={classes.soundItem} key={index}>
                    <div className={classes.title}>{sound.title}</div>
                    <CustomSlider
                      value={sound.isPlay !== true ? 0 : sound.volumn}
                      height="2.4rem"
                      thumbSize="2.4rem"
                      thumbIcon={sound.thumbnail}
                      disableOption={true}
                      onChange={(e: any) =>
                        handleSoundVolumnChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {state.currentTypeIndex === 0 && (
            // &&
            //   state.otherSounds &&
            //   state.otherSounds?.length > 0
            <div className={classes.soundWrapper}>
              <div className={classes.heading}>
                <label htmlFor="">All sounds</label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 0C9.2046 0 9.40081 0.063214 9.54548 0.175736C9.69015 0.288258 9.77143 0.44087 9.77143 0.6V13.4C9.77143 13.5591 9.69015 13.7117 9.54548 13.8243C9.40081 13.9368 9.2046 14 9 14C8.7954 14 8.59919 13.9368 8.45452 13.8243C8.30985 13.7117 8.22857 13.5591 8.22857 13.4V0.6C8.22857 0.44087 8.30985 0.288258 8.45452 0.175736C8.59919 0.063214 8.7954 0 9 0ZM4.88571 2.4C5.09031 2.4 5.28653 2.46321 5.4312 2.57574C5.57587 2.68826 5.65714 2.84087 5.65714 3V11C5.65714 11.1591 5.57587 11.3117 5.4312 11.4243C5.28653 11.5368 5.09031 11.6 4.88571 11.6C4.68112 11.6 4.4849 11.5368 4.34023 11.4243C4.19556 11.3117 4.11429 11.1591 4.11429 11V3C4.11429 2.84087 4.19556 2.68826 4.34023 2.57574C4.4849 2.46321 4.68112 2.4 4.88571 2.4ZM13.1143 2.4C13.3189 2.4 13.5151 2.46321 13.6598 2.57574C13.8044 2.68826 13.8857 2.84087 13.8857 3V11C13.8857 11.1591 13.8044 11.3117 13.6598 11.4243C13.5151 11.5368 13.3189 11.6 13.1143 11.6C12.9097 11.6 12.7135 11.5368 12.5688 11.4243C12.4241 11.3117 12.3429 11.1591 12.3429 11V3C12.3429 2.84087 12.4241 2.68826 12.5688 2.57574C12.7135 2.46321 12.9097 2.4 13.1143 2.4ZM0.771429 5.6C0.976024 5.6 1.17224 5.66321 1.31691 5.77574C1.46158 5.88826 1.54286 6.04087 1.54286 6.2V7.8C1.54286 7.95913 1.46158 8.11174 1.31691 8.22426C1.17224 8.33679 0.976024 8.4 0.771429 8.4C0.566833 8.4 0.370617 8.33679 0.225946 8.22426C0.0812752 8.11174 0 7.95913 0 7.8V6.2C0 6.04087 0.0812752 5.88826 0.225946 5.77574C0.370617 5.66321 0.566833 5.6 0.771429 5.6ZM17.2286 5.6C17.4332 5.6 17.6294 5.66321 17.7741 5.77574C17.9187 5.88826 18 6.04087 18 6.2V7.8C18 7.95913 17.9187 8.11174 17.7741 8.22426C17.6294 8.33679 17.4332 8.4 17.2286 8.4C17.024 8.4 16.8278 8.33679 16.6831 8.22426C16.5384 8.11174 16.4571 7.95913 16.4571 7.8V6.2C16.4571 6.04087 16.5384 5.88826 16.6831 5.77574C16.8278 5.66321 17.024 5.6 17.2286 5.6Z"
                    fill="black"
                  />
                </svg>
              </div>

              <div className={classes.soundList}>
                {state.soundList
                  .filter((sound: any) => {
                    return !state.currentScenarioSound
                      .map((i: any) => i.id)
                      .includes(sound.id_sound);
                  })
                  .map((sound: any, index: number) => {
                    return (
                      <div className={classes.soundItem} key={index}>
                        <div className={classes.title}>{sound.title}</div>
                        <CustomSlider
                          value={sound.isPlay !== true ? 0 : sound.volumn}
                          height="2.4rem"
                          thumbSize="2.4rem"
                          thumbIcon={sound.thumbnail}
                          disableOption={true}
                          onChange={(e: any) =>
                            handleSoundVolumnChange(
                              index + state.currentScenarioSound?.length,
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {state.currentTypeIndex !== 0 &&
            typeof state.currentTypeIndex === "number" && (
              // state.otherSounds &&
              // state.otherSounds?.length > 0 &&
              <div className={classes.soundWrapper}>
                <div className={classes.heading}>
                  <label htmlFor="">All sounds</label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 0C9.2046 0 9.40081 0.063214 9.54548 0.175736C9.69015 0.288258 9.77143 0.44087 9.77143 0.6V13.4C9.77143 13.5591 9.69015 13.7117 9.54548 13.8243C9.40081 13.9368 9.2046 14 9 14C8.7954 14 8.59919 13.9368 8.45452 13.8243C8.30985 13.7117 8.22857 13.5591 8.22857 13.4V0.6C8.22857 0.44087 8.30985 0.288258 8.45452 0.175736C8.59919 0.063214 8.7954 0 9 0ZM4.88571 2.4C5.09031 2.4 5.28653 2.46321 5.4312 2.57574C5.57587 2.68826 5.65714 2.84087 5.65714 3V11C5.65714 11.1591 5.57587 11.3117 5.4312 11.4243C5.28653 11.5368 5.09031 11.6 4.88571 11.6C4.68112 11.6 4.4849 11.5368 4.34023 11.4243C4.19556 11.3117 4.11429 11.1591 4.11429 11V3C4.11429 2.84087 4.19556 2.68826 4.34023 2.57574C4.4849 2.46321 4.68112 2.4 4.88571 2.4ZM13.1143 2.4C13.3189 2.4 13.5151 2.46321 13.6598 2.57574C13.8044 2.68826 13.8857 2.84087 13.8857 3V11C13.8857 11.1591 13.8044 11.3117 13.6598 11.4243C13.5151 11.5368 13.3189 11.6 13.1143 11.6C12.9097 11.6 12.7135 11.5368 12.5688 11.4243C12.4241 11.3117 12.3429 11.1591 12.3429 11V3C12.3429 2.84087 12.4241 2.68826 12.5688 2.57574C12.7135 2.46321 12.9097 2.4 13.1143 2.4ZM0.771429 5.6C0.976024 5.6 1.17224 5.66321 1.31691 5.77574C1.46158 5.88826 1.54286 6.04087 1.54286 6.2V7.8C1.54286 7.95913 1.46158 8.11174 1.31691 8.22426C1.17224 8.33679 0.976024 8.4 0.771429 8.4C0.566833 8.4 0.370617 8.33679 0.225946 8.22426C0.0812752 8.11174 0 7.95913 0 7.8V6.2C0 6.04087 0.0812752 5.88826 0.225946 5.77574C0.370617 5.66321 0.566833 5.6 0.771429 5.6ZM17.2286 5.6C17.4332 5.6 17.6294 5.66321 17.7741 5.77574C17.9187 5.88826 18 6.04087 18 6.2V7.8C18 7.95913 17.9187 8.11174 17.7741 8.22426C17.6294 8.33679 17.4332 8.4 17.2286 8.4C17.024 8.4 16.8278 8.33679 16.6831 8.22426C16.5384 8.11174 16.4571 7.95913 16.4571 7.8V6.2C16.4571 6.04087 16.5384 5.88826 16.6831 5.77574C16.8278 5.66321 17.024 5.6 17.2286 5.6Z"
                      fill="black"
                    />
                  </svg>
                </div>

                <div className={classes.soundList}>
                  {state.soundList
                    .filter((sound: any) => {
                      console.log(sound);

                      return !state.currentScenarioSound
                        .map((i: any) => i.id)
                        .includes(sound.id_sound);
                    })
                    .filter((sound: any, index: number) => {
                      if (
                        sound.id_type ===
                        state.soundType[state.currentTypeIndex - 1].id_type
                      )
                        return true;
                      // console.log([
                      //   sound.id_type,
                      //   state.soundType[state.currentTypeIndex].id_type,
                      // ]);
                      // return true;
                    })
                    .map((sound: any, index: number) => {
                      return (
                        <div className={classes.soundItem} key={index}>
                          <div className={classes.title}>{sound.title}</div>
                          <CustomSlider
                            value={sound.isPlay !== true ? 0 : sound.volumn}
                            height="2.4rem"
                            thumbSize="2.4rem"
                            thumbIcon={sound.thumbnail}
                            disableOption={true}
                            onChange={(e: any) =>
                              handleSoundVolumnChange(
                                index + state.currentScenarioSound?.length,
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
        </div>
      )}
      {typeButton === "music" && (
        <div className={classes.musicListWrapper}>
          {state.musicList
            .filter((music: any, index: number) => {
              if (
                state.currentTypeIndex > 0 &&
                music.id_type ===
                  state.musicType[state.currentTypeIndex - 1]?.id_type
              )
                return true;
              else if (state.currentTypeIndex === 0) return true;
              // console.log([
              //   sound.id_type,
              //   state.soundType[state.currentTypeIndex].id_type,
              // ]);
              // return true;
            })
            .map((music: any, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => onClickMusicHandle(music)}
                  className={clsx(classes.musicItem, {
                    [classes.musicItem__active]:
                      music.id_music === state.playingMusic.id,
                  })}
                >
                  <div>
                    {
                      <ReactSVG
                        className={classes.icon}
                        src={music.type.thumbnail}
                      />
                    }
                  </div>
                  <div className={classes.musicContentWrapper}>
                    <div className={classes.name}>{music.title}</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className={classes.type}>{music.type.label}</div>
                      {music.author?.name && (
                        <div className={classes.author}>
                          {"by " + music.author?.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SoundSetting;
