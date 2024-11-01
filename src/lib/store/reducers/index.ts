// store/reducers/index.js
import { combineReducers } from "redux";
import counterReducer from "./counterSlices";
import profileReducer from "./profileSlices";

const rootReducer = combineReducers({
  counter: counterReducer,
  profile: profileReducer,
});

export default rootReducer;
