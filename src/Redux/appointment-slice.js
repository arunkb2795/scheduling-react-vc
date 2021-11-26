import { createSlice } from "@reduxjs/toolkit";
import scheduleClient from "../api/scheduleClient";
import moment from "moment";
const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointmentLoading: false,
    agent: [],
    customers: [],
    moderator: [],
    timeZone: null,
    date: null,
    startTime: null,
    endTime: null,
    schedule_type: [],
    title: null,
    description: null,
  },
  reducers: {
    setAppointmentData(state, action) {
      state.agent = action.payload.agent;
      state.customers = action.payload.customers;
      state.moderator = action.payload.moderator;
      state.timeZone = action.payload.timeZone;
      state.date = action.payload.date;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.schedule_type = action.payload.schedule_type;
      state.title = action.payload.title;
      state.description = action.payload.description;
    },
    setIsLoading(state, action) {
      state.appointmentLoading = action.payload;
    },
  },
});

export const getAppointment = (id, type) => {
  return async (dispatch) => {
    try {
      if (type === "schedule") {
        dispatch(appointmentAction.setIsLoading(true));
        const appointmentResponse = await scheduleClient.getScheduleById(id);
        let data = {
          agent: appointmentResponse.data.agent,
          customers: appointmentResponse.data.customers,
          moderator: [],
          date: appointmentResponse.data.date,
          startTime: appointmentResponse.data.start,
          endTime: appointmentResponse.data.stop,
          timeZone: appointmentResponse.data.agent[0].time_zone,
          schedule_type: appointmentResponse.data.schedule_type,
          title: appointmentResponse.data.title,
          description: appointmentResponse.data.description,
        };
        dispatch(appointmentAction.setAppointmentData(data));
        dispatch(appointmentAction.setIsLoading(false));
      } else if (type === "event") {
        dispatch(appointmentAction.setIsLoading(true));
        const appointmentResponse = await scheduleClient.getEventById(id);
        let data = {
          agent: appointmentResponse.data.agent,
          customers: appointmentResponse.data.customers,
          moderator: [],
          date: moment(appointmentResponse.data.start).format("YYYY-MM-DD"),
          startTime: appointmentResponse.data.start,
          endTime: appointmentResponse.data.stop,
          timeZone: appointmentResponse.data.agent[0].time_zone,
          schedule_type: [],
          title: appointmentResponse.data.title,
          description: appointmentResponse.data.description,
        };
        dispatch(appointmentAction.setAppointmentData(data));
        dispatch(appointmentAction.setIsLoading(false));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const appointmentAction = appointmentSlice.actions;
export const appointmentReducer = appointmentSlice.reducer;
