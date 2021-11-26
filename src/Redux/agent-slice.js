import { createSlice } from "@reduxjs/toolkit";
import axios from "../api/axios";

const agentSlice = createSlice({
  name: "agent-list",
  initialState: {
    isLoading: false,
    agentList: null,
    agentDropdownList: [],
    resourcesList: [],
  },
  reducers: {
    setAgentList(state, action) {
      state.agentList = action.payload;
      state.agentDropdownList = action.payload.map(({ id, name, ...rest }) => ({
        value: id,
        label: name,
        ...rest,
      }));

      state.resourcesList = action.payload.map(({ id, name }) => ({
        id: id,
        title: name,
      }));
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const getAgentList = () => {
  console.log("hello")
  return async (dispatch) => {
    try {
      dispatch(agentAction.setIsLoading(true));
      const response = await axios.get("/agent/").then(function (response) {
        return response;
      });
      console.log(response);
      dispatch(agentAction.setAgentList(response.data));
      dispatch(agentAction.setIsLoading(false));
    } catch (err) {
      console.log(err);
    }
  };
};

export const agentAction = agentSlice.actions;
export const agentReducer = agentSlice.reducer;
