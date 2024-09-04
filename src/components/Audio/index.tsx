"use client";

import { SoundModel } from "@/utils/models/SoundModel";
import { useContext, useEffect, useRef, useState } from "react";
import classes from "./Audio.module.scss";
import clsx from "clsx";
import { AppContext } from "@/app/layout";
import CustomSlider from "../CustomSlider";

const Audio = () => {
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const musicRef = useRef<HTMLAudioElement>(null);
  const { state, dispatch } = useContext(AppContext);

  // Ghi đè giá trị của ref khi phần tử audio được render
  const setRef = (index: number) => (el: HTMLAudioElement | null) => {
    if (el) {
      audioRefs.current[index] = el;
    }
  };

  // Play indexed audio
  const playAudio = (index: number) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index].play();
    }
  };

  const pauseAudio = (index: number) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index].pause();
    }
  };

  // Toggle Sound isPlay
  const onClickToggleSound = (index: number) => {
    dispatch({
      type: "CURRENT_SCENARIO_SOUND",
      payload: state.currentScenarioSound.map(
        (sound: any, soundIndex: number) => {
          if (soundIndex === index) {
            return {
              ...sound,
              isPlay: audioRefs.current[index].paused,
            };
          }
          return sound;
        }
      ),
    });
  };

  // Change music volumn
  const handleVolumeChange = (index: number, value: number) => {
    if (Number.isFinite(value) && value >= 0 && value <= 1) {
      dispatch({
        type: "CURRENT_SCENARIO_SOUND",
        payload: state.currentScenarioSound.map(
          (sound: any, soundIndex: number) => {
            if (soundIndex === index) {
              return {
                ...sound,
                volumn: value,
              };
            }
            return sound;
          }
        ),
      });
    } else {
      console.warn("Invalid volume value:", value);
    }
  };

  const playMusic = () => {
    if (musicRef.current) {
      musicRef.current.play();
    }
    // console.log(musicRef.current);
  };

  const pauseMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
    }
  };

  useEffect(() => {
    console.log("Play or pause music, set volumn when playingMusic change");

    if (musicRef.current) {
      const volume = state.playingMusic.volumn;
      // Kiểm tra volume trước khi set
      if (Number.isFinite(volume) && volume >= 0 && volume <= 1) {
        musicRef.current.volume = volume;
      } else {
        musicRef.current.volume = 0.5; // Giá trị mặc định an toàn
      }
    }

    if (state.playingMusic.isPlay === true) {
      playMusic();
    } else {
      pauseMusic();
    }
  }, [state.playingMusic]);

  // Reload when change playing music
  useEffect(() => {
    console.log("Play music when playingMusic path change");

    if (state.playingMusic.path) {
      musicRef.current?.pause();
      musicRef.current?.load();
      musicRef.current?.play();
    }
  }, [state.playingMusic.path]);

  // Reload when change volumn sound
  useEffect(() => {
    console.log("Reload sounds volumn when currentScenarioSound change");

    (state.currentScenarioSound as SoundModel[]).forEach(
      (sound: SoundModel, soundIndex: number) => {
        if (audioRefs.current[soundIndex]) {
          const volume = sound.volumn;
          // Kiểm tra volume trước khi set
          if (Number.isFinite(volume) && volume >= 0 && volume <= 1) {
            audioRefs.current[soundIndex].volume = volume;
          } else {
            audioRefs.current[soundIndex].volume = 0.5; // Giá trị mặc định an toàn
          }

          if (sound.isPlay === true) {
            playAudio(soundIndex);
          } else {
            pauseAudio(soundIndex);
          }
        }
      }
    );
  }, [state.currentScenarioSound]);

  useEffect(() => {
    console.log();

    state.soundList
      .filter((sound: any) => {
        // console.log(sound);

        return !state.currentScenarioSound
          .map((i: any) => i.id)
          .includes(sound.id_sound);
      })
      .forEach((sound: SoundModel, s: number) => {
        const soundIndex = s + state.currentScenarioSound.length;
        // console.log(sound, s, soundIndex);
        if (audioRefs.current[soundIndex]) {
          const volume = sound.volumn;
          // Kiểm tra volume trước khi set
          if (Number.isFinite(volume) && volume >= 0 && volume <= 1) {
            audioRefs.current[soundIndex].volume = volume;
          } else {
            audioRefs.current[soundIndex].volume = 0.5; // Giá trị mặc định an toàn
          }

          if (sound.isPlay === true) {
            playAudio(soundIndex);
          } else {
            pauseAudio(soundIndex);
          }
        }
      });
  }, [state.soundList]);

  return (
    <>
      {(state.currentScenarioSound as any[]).map((sound, index) => {
        return (
          <div
            key={index}
            className={classes.sound}
            style={
              {
                "--left": `${sound.locationX}%`,
                "--bottom": `${sound.locationY}%`,
              } as React.CSSProperties
            }
          >
            <div
              className={clsx(classes.soundBall, {
                [classes.soundBall__active]: sound.isPlay,
              })}
              onClick={() => onClickToggleSound(index)}
            >
              <div
                className={classes.label}
                onClick={(e) => e.stopPropagation()}
              >
                {sound.title}
                {sound.isPlay && (
                  <div className={classes.volumnWrapper}>
                    <CustomSlider
                      value={sound.volumn}
                      onChange={(e: any) =>
                        handleVolumeChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                )}
              </div>
              <audio ref={setRef(index)} loop>
                <source src={sound.path} type="audio/ogg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        );
      })}
      {state.soundList
        .filter((sound: any) => {
          // console.log(sound);

          return !state.currentScenarioSound
            .map((i: any) => i.id)
            .includes(sound.id_sound);
        })
        .map((sound: any, index: number) => {
          return (
            <audio
              ref={setRef(index + state.currentScenarioSound.length)}
              loop
              key={index}
            >
              <source src={sound.sound_path} type="audio/ogg" />
              Your browser does not support the audio tag.
            </audio>
          );
        })}
      {/* {state.playingMusic.path && (
      )} */}
      <audio
        ref={musicRef}
        loop
        style={{ position: "absolute", left: "100px" } as any}
      >
        <source src={state.playingMusic.path} type="audio/ogg" />
        {/* <source src={state.playingMusic.path} type="audio/ogg" /> */}
        Your browser does not support the audio tag.
      </audio>
    </>
  );
};

export default Audio;
