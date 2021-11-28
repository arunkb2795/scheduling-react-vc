import { createSlice } from "@reduxjs/toolkit";
import scheduleClient from "../api/scheduleClient";

const setStatus = (status) => {
  if (status === "Completed") {
    return "#28a745";
  } else if (status === "Cancelled") {
    return "#dc3545";
  } else if (status === "No Show") {
    return "#707070";
  } else if (status === "Coc Violation") {
    return "#FFFF00";
  } else if (status === "Incomplete") {
    return "#999900";
  } else if (status === "Upcoming" || status === "Rescheduled") {
    return "#685bc7";
  }
};
const eventDetailsSlice = createSlice({
  name: "event-details",
  initialState: {
    isLoading: false,
    events: [],
    selectedAgent: null,
    searchText: null,
    start: null,
    end: null,
    type: null,
  },
  reducers: {
    setCalenderEvents(state, action) {
      state.events = action.payload;
    },
    addCalenderEvent(state, action) {
      state.events = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setSelectedAgent(state, action) {
      state.selectedAgent = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setDate(state, action) {
      state.start = action.payload.start;
      state.end = action.payload.end;
    },
    setType(state, action) {
      state.type = action.payload;
    },
  },
});

export const getCalenderEvents = (id, searchText, start, end) => {
  return async (dispatch) => {
    try {
      if (searchText && id) {
        let data = [];
        dispatch(eventDetailsAction.setIsLoading(true));
        const scheduleResponse =
          await scheduleClient.getScheduleDetailsBySearch(
            id,
            searchText,
            start,
            end
          );
        let scheduleData = scheduleResponse.data.map(
          ({ id, title, start, stop, agent, status }) => ({
            id: id,
            type: "schedule",
            resourceId: agent[0].id,
            title: title,
            start: start,
            end: stop,
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
          })
        );
        const eventResponse = await scheduleClient.getEventDetailsBySearch(
          id,
          searchText,
          start,
          end
        );

        let eventData = eventResponse.data.map(
          ({ id, title, start, stop, agent, status }) => ({
            id: id,
            type: "event",
            resourceId: agent[0].id,
            title: title,
            start: start,
            end: stop,
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
          })
        );
        data = [...eventData, ...scheduleData];
        dispatch(eventDetailsAction.setCalenderEvents(data));
        dispatch(eventDetailsAction.setIsLoading(false));
      } else if (id) {
        let data = [];
        dispatch(eventDetailsAction.setIsLoading(true));
        const eventResponse = await scheduleClient.getEventDetails(
          id,
          start,
          end
        );
        let eventData = eventResponse.data.map(
          ({ id, title, start, stop, agent, status }) => ({
            id: id,
            type: "event",
            resourceId: agent[0].id,
            title: title,
            start: start,
            end: stop,
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
          })
        );
        const scheduleResponse = await scheduleClient.getScheduleDetails(
          id,
          start,
          end
        );
        let scheduleData = scheduleResponse.data.map(
          ({ id, title, start, stop, agent, status }) => ({
            id: id,
            type: "schedule",
            resourceId: agent[0].id,
            title: title,
            start: start,
            end: stop,
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
          })
        );
        data = [...eventData, ...scheduleData];
        dispatch(eventDetailsAction.setCalenderEvents(data));
        dispatch(eventDetailsAction.setIsLoading(false));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const addEvents = (data) => {
  return async (dispatch) => {
    try {
        dispatch(eventDetailsAction.setCalenderEvents(data));
    } catch(err) {
      console.log(err);
    }
  }
}

export const eventDetailsAction = eventDetailsSlice.actions;
export const eventDetailsReducer = eventDetailsSlice.reducer;
