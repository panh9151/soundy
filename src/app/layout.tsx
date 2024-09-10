"use client";

import Background from "@/components/Background";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import * as SoundServices from "@/services/soundServices";
import * as ScenarioService from "@/services/scenarioServices";
import * as TypeServices from "@/services/typeServices";
import * as MusicServices from "@/services/musicServices";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "./globalState";
import Number from "@/utils/Number";
import "../assets/scss/index.scss";

const metaData = {
  title: "Next.js 123",
  description: "Generate by Next.js",
};

const AppContext = createContext<any>(undefined);
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState({
    scenario: true,
    currentMusic: true,
    soundList: true,
    soundType: true,
    musicType: true,
  });

  useEffect(() => {
    console.log("First rendering");

    ScenarioService.getDefaultItem().then((res: any) => {
      // Set background to loading state
      // dispatch({ type: "LOADING_BACKGROUND", payload: true });

      // Update default scenario
      dispatch({ type: "CURRENT_SCENARIO", payload: res.result.data });
      dispatch({
        type: "CURRENT_SCENARIO_SOUND",
        payload: res.result.data.sounds.map((sound: any) => {
          return {
            ...sound,
            isPlay: false,
            volumn: sound.defaultVolumn || 0.5,
          };
        }),
      });
      dispatch({ type: "CURRENT_SCENARIO_MUSIC", payload: res.result.data });

      // Get music
      const randomIndex = Number.getRandomInRange(
        0,
        res.result.data.musics.length
      );
      dispatch({
        type: "PLAYING_MUSIC",
        payload: {
          ...res.result.data.musics[randomIndex],
          volumn: 0.5,
          isPlay: false,
        },
      });

      // dispatch({ type: "LOADING_BACKGROUND", payload: false });
      setLoading((prev: any) => {
        return { ...prev, scenario: false, currentMusic: false };
      });
    });

    ScenarioService.getList().then((res: any) => {
      dispatch({ type: "SCENARIO_LIST", payload: res.result.data });

      setLoading((prev: any) => {
        return { ...prev, musicType: false };
      });
    });

    TypeServices.getSoundType().then((res: any) => {
      dispatch({ type: "SOUND_TYPE", payload: res.result.data });
      setLoading((prev: any) => {
        return { ...prev, soundType: false };
      });
    });

    TypeServices.getMusicType().then((res: any) => {
      dispatch({ type: "MUSIC_TYPE", payload: res.result.data });
      setLoading((prev: any) => {
        return { ...prev, musicType: false };
      });
    });

    SoundServices.getList().then((res: any) => {
      dispatch({ type: "SOUND_LIST", payload: res.result });
      setLoading((prev: any) => {
        return { ...prev, soundList: false };
      });
    });

    MusicServices.getList().then((res: any) => {
      dispatch({ type: "MUSIC_LIST", payload: res.result.data });
      // console.log(res);
    });
  }, []);

  // useEffect(() => {
  //   // if (state.otherSounds.length === 0) {
  //   dispatch({
  //     type: "OTHER_SOUNDS",
  //     payload: state.soundList
  //       .filter((sound: any) => {
  //         // Check if the sound ID is included in currentScenarioSound
  //         return !state.currentScenarioSound
  //           .map((i: any) => i.id)
  //           .includes(sound.id_sound);
  //       })
  //       .map((sound: any, index: number) => {
  //         return {
  //           ...sound,
  //           volumn:
  //             typeof (sound.volumn as number) === "number" ? sound.volumn : 0,
  //           isPlay: typeof sound.volumn === "boolean" ? sound.isPlay : false,
  //         };
  //       }),
  //   });
  //   // } else {
  // }, [
  //   state.soundList,
  //   // state.currentScenarioSound
  // ]);

  useEffect(() => {
    // console.log([
    //   state.otherSounds,
    //   state.otherSounds
    //     .filter((sound: any) => {
    //       // Check if the sound ID is included in currentScenarioSound
    //       return !state.currentScenarioSound
    //         .map((i: any) => i.id)
    //         .includes(sound.id_sound);
    //     })
    //     .map((sound: any, index: number) => {
    //       return {
    //         ...sound,
    //         volumn:
    //           typeof (sound.volumn as number) === "number" ? sound.volumn : 0,
    //         isPlay: typeof sound.volumn === "boolean" ? sound.isPlay : false,
    //       };
    //     }),
    // ]);
    // console.log("Update otherSounds when currentScenarioSound change");
    // dispatch({
    //   type: "OTHER_SOUNDS",
    //   payload: state.otherSounds
    //     .filter((sound: any) => {
    //       // Check if the sound ID is included in currentScenarioSound
    //       return !state.currentScenarioSound
    //         .map((i: any) => i.id)
    //         .includes(sound.id_sound);
    //     })
    //     .map((sound: any, index: number) => {
    //       return {
    //         ...sound,
    //         volumn:
    //           typeof (sound.volumn as number) === "number" ? sound.volumn : 0,
    //         isPlay: typeof sound.volumn === "boolean" ? sound.isPlay : false,
    //       };
    //     }),
    // });
  }, [state.currentScenarioSound]);

  useEffect(() => {
    console.log(
      "Update sounds, music and playing music when currentScenario change"
    );

    dispatch({
      type: "CURRENT_SCENARIO_SOUND",
      payload: state.currentScenario.sounds
        ? state.currentScenario.sounds.map((sound: any) => {
            return {
              ...sound,
              isPlay: false,
              volumn: sound.defaultVolumn || 0.5,
            };
          })
        : [],
    });
    dispatch({
      type: "CURRENT_SCENARIO_MUSIC",
      payload: state.currentScenario,
    });

    // Get music
    const randomIndex = Number.getRandomInRange(
      0,
      state.currentScenario.musics ? state.currentScenario.musics.length : 0
    );
    dispatch({
      type: "PLAYING_MUSIC",
      payload: state.currentScenario.musics
        ? {
            ...state.currentScenario.musics[randomIndex],
            volumn: 0.5,
            isPlay: false,
          }
        : [],
    });
  }, [state.currentScenario]);

  return (
    <html lang="en">
      <head>
        <title>Soundy - Lofi & Chill</title>
        <meta name="description" content="Soundy website description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="../favicon.ico" /> */}
      </head>
      <body
      //  onClick={onClickBodyHandle}
      >
        <AppContext.Provider value={{ state, dispatch }}>
          <Background />
          {Object.values(loading).every((value) => value !== true) && (
            <>
              <header>
                <Header />
              </header>
              <div>
                <Sidebar />
              </div>
              {/* Layout UI */}
              <main>{children}</main>
              <footer>
                <Footer />
              </footer>
            </>
          )}
        </AppContext.Provider>
      </body>
    </html>
  );
};

export default RootLayout;
export { AppContext };
