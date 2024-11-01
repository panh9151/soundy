export type Action = {
  type:
    | "CURRENT_SCENARIO_SOUND"
    | "CURRENT_SCENARIO_MUSIC"
    | "CURRENT_SCENARIO"
    | "SOUND_LIST"
    | "MUSIC_LIST"
    | "SCENARIO_LIST"
    | "SOUND_TYPE"
    | "MUSIC_TYPE"
    | "PLAYING_MUSIC"
    | "OTHER_SOUNDS"
    | "CURRENT_TYPE_INDEX"
    | "CURRENT_STATE_SCENARIO"
    | "LOADING_BACKGROUND"
    | "IS_RELOAD_SOUNDS"
  payload: any;
};

export const initialState = {
  currentScenarioSound: [],
  currentScenarioMusic: [],
  currentScenario: {},
  soundList: [],
  musicList: [],
  scenarioList: [],
  soundType: [],
  musicType: [],
  playingMusic: {},
  otherSounds: [],
  currentTypeIndex: 0,
  currentStateScenario: { time: "day", weather: "clear" },
  loadingBackground: false,
  isReloadSounds: {},
};

// Reducer
export const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "CURRENT_SCENARIO_SOUND":
      return {
        ...state,
        currentScenarioSound: action.payload,
      };
    case "CURRENT_SCENARIO_MUSIC":
      return {
        ...state,
        currentScenarioMusic: action.payload,
      };
    case "CURRENT_SCENARIO":
      return {
        ...state,
        currentScenario: action.payload,
      };
    case "SOUND_LIST":
      return {
        ...state,
        soundList: action.payload,
      };
    case "MUSIC_LIST":
      return {
        ...state,
        musicList: action.payload,
      };
    case "SCENARIO_LIST":
      return {
        ...state,
        scenarioList: action.payload,
      };
    case "SOUND_TYPE":
      return {
        ...state,
        soundType: action.payload,
      };
    case "MUSIC_TYPE":
      return {
        ...state,
        musicType: action.payload,
      };
    case "PLAYING_MUSIC":
      return {
        ...state,
        playingMusic: action.payload,
      };
    case "OTHER_SOUNDS":
      return {
        ...state,
        otherSounds: action.payload,
      };
    case "CURRENT_TYPE_INDEX":
      return {
        ...state,
        currentTypeIndex: action.payload,
      };
    case "CURRENT_STATE_SCENARIO":
      return {
        ...state,
        currentStateScenario: action.payload,
      };
    case "LOADING_BACKGROUND":
      return {
        ...state,
        loadingBackground: action.payload,
      };
    case "IS_RELOAD_SOUNDS":
      return {
        ...state,
        isReloadSounds: action.payload,
      };
    default:
      return state;
  }
};
