import { combineReducers } from "@reduxjs/toolkit";
import engineConfigurationReducer from "./engineConfiguration";
import engineStatusReducer from "./engineStatus";

const engineReducer = combineReducers({
  configuration: engineConfigurationReducer,
  status: engineStatusReducer,
});

export default engineReducer;
