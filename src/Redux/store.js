import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { agentReducer } from "./agent-slice";
import {eventDetailsReducer} from "./eventDetails-slice";

const RootReducer = () =>
  combineReducers({
    agentReducer,
    eventDetailsReducer,
  });

const store = configureStore({
  reducer: RootReducer(),
});
export default store;
