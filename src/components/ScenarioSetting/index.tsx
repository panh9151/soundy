import { AppContext } from "@/app/layout";
import { useContext, useReducer } from "react";
import classes from "./ScenarioSetting.module.scss";
import clsx from "clsx";

const ScenarioSetting = () => {
  const { state, dispatch } = useContext(AppContext);

  const changeScenarioHandle = (id: string) => {
    const newScenario = state.scenarioList.filter(
      (i: any) => i.id_scenario === id
    )[0];
    // console.log(state.currentScenario.sounds, newScenario.sounds);
    dispatch({ type: "IS_RELOAD_SOUNDS", payload: {} });
    dispatch({
      type: "CURRENT_SCENARIO",
      payload: {
        createdAt: newScenario.created_at,
        day_url: newScenario.day_url,
        id: newScenario.id_scenario,
        lastUpdated: newScenario.last_updated,
        musics: newScenario.musics,
        name: newScenario.name,
        night_url: newScenario.night_url,
        path: newScenario.img_path,
        rain_day_url: newScenario.rain_day_url,
        rain_night_url: newScenario.rain_night_url,
        sounds: newScenario.sounds,
      },
    });
  };

  return (
    <div className={classes.scenario}>
      <div className={classes.scenarioList}>
        {state.scenarioList.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                if (item.id_scenario !== state.currentScenario.id)
                  changeScenarioHandle(item.id_scenario);
              }}
              key={index}
              className={clsx(classes.scenarioItem, {
                [classes.scenarioItem__active]:
                  item.id_scenario === state.currentScenario.id,
              })}
            >
              <img src={item.img_path} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioSetting;
