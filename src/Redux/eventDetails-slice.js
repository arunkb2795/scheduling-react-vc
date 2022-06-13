import {
  createSlice
} from "@reduxjs/toolkit";
import scheduleClient from "../api/scheduleClient";
import momentTz from "moment-timezone";
import moment from "moment";
import styles from "./styles.module.scss";

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
  } else if (
    status === "Upcoming" ||
    status === "Rescheduled" ||
    status === "New"
  ) {
    return "#685bc7";
  } else if (status === "Absence") {
    return "#A9A8AF";
  }
};

const setFadeStatus = (status) => {
  if (status === "Completed") {
    return "#93d3a2";
  } else if (status === "Cancelled") {
    return "#ed9aa2";
  } else if (status === "No Show") {
    return "#b7b7b7";
  } else if (status === "Coc Violation") {
    return "#ffff7f";
  } else if (status === "Incomplete") {
    return "#cccc7f";
  } else if (
    status === "Upcoming" ||
    status === "Rescheduled" ||
    status === "New"
  ) {
    return "#b3ade3";
  }
};

const setBorder = (status) => {
  if (status === "Completed") {
    return styles.CompletedStyles;
  } else if (status === "Cancelled") {
    return styles.CancelledStyles;
  } else if (status === "No Show") {
    return styles.NoShowStyles;
  } else if (status === "Coc Violation") {
    return styles.CocViolationStyles;
  } else if (status === "Incomplete") {
    return styles.IncompleteStyles;
  } else if (
    status === "Upcoming" ||
    status === "Rescheduled" ||
    status === "New"
  ) {
    return styles.UpcomingStyles;
  }
};

const setFadeBorder = (status) => {
  if (status === "Completed") {
    return styles.CompletedFadedStyles;
  } else if (status === "Cancelled") {
    return styles.CancelledFadedStyles;
  } else if (status === "No Show") {
    return styles.NoShowFadedStyles;
  } else if (status === "Coc Violation") {
    return styles.CocViolationFadedStyles;
  } else if (status === "Incomplete") {
    return styles.IncompleteFadedStyles;
  } else if (
    status === "Upcoming" ||
    status === "Rescheduled" ||
    status === "New"
  ) {
    return styles.UpcomingFadedStyles;
  }
}

const eventDetailsSlice = createSlice({
  name: "event-details",
  initialState: {
    isLoadingSchedule: false,
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
      state.isLoadingSchedule = action.payload;
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

const timeConvertor = (data, agentTimezone, moderatorTimezone) => {
  var newYork = momentTz.tz(data, agentTimezone);
  var losAngeles = newYork.clone().tz(moderatorTimezone);
  return moment(losAngeles).format("YYYY-MM-DDTHH:mm:ss");
};

export const getCalenderEvents = (id, start, end) => {
  return async (dispatch) => {
    try {
      if (start && end) {
        let data = [];
        dispatch(eventDetailsAction.setIsLoading(true));
        const eventResponse = id ?
          await scheduleClient.getEventDetails(id, start, end) :
          await scheduleClient.getAllEvents(start, end);
        console.log({
          eventResponse
        });
        let agentData = eventResponse.data.map(
          ({
            id,
            title,
            start,
            stop,
            agent,
            moderator,
            status
          }) => ({
            id: id,
            type: "event",
            resourceId: agent[0].id,
            title: `ID: #${id},Type: Event,Title :${title},Consultant :${
              agent[0].name
            },${moderator.length ? `Moderator:${moderator[0]?.name}` : ""} `,
            start: start.slice(0, 19),
            end: stop.slice(0, 19),
            backgroundColor: "#ffffff",
            borderColor: setStatus(status),
            textColor: setStatus(status),
            classNames: setBorder(status),
            user: "agent",
          })
        );

        let moderatorData = eventResponse.data.map(
          ({
            id,
            title,
            start,
            stop,
            agent,
            moderator,
            status
          }) => ({
            id: id,
            type: "event",
            resourceId: moderator[0].id,
            title: `ID: #${id},Type: Event,Title :${title},Consultant :${
              agent[0].name
            },${moderator.length ? `Moderator:${moderator[0]?.name}` : ""}`,
            start: timeConvertor(
              start.slice(0, 19),
              agent[0].time_zone,
              moderator[0].time_zone
            ),
            end: timeConvertor(
              stop.slice(0, 19),
              agent[0].time_zone,
              moderator[0].time_zone
            ),
            backgroundColor: "#fff",
            borderColor: setStatus(status),
            textColor: setStatus(status),
            classNames: setBorder(status),
            user: "moderator",
          })
        );
        let combinedEventData = [...agentData, ...moderatorData];

        let filteredCombinedEventData = combinedEventData.filter((item) => {
          return item.resourceId !== undefined;
        });

        const scheduleResponse = id ?
          await scheduleClient.getScheduleDetails(id, start, end) :
          await scheduleClient.getAllSchedules(start, end);
        console.log({
          scheduleResponse
        });
        let agentScheduleData = scheduleResponse.data.map(
          ({
            id,
            title,
            start,
            stop,
            agent,
            moderator,
            status
          }) => ({
            id: id,
            type: "schedule",
            resourceId: agent[0].id,
            title: `ID: #${id},Type: Schedule,Title :${title},Consultant:${
              agent[0].name
            },${moderator.length ? `Moderator:${moderator[0]?.name}` : ""} `,
            start: start.slice(0, 19),
            end: stop.slice(0, 19),
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
            user: "agent",
          })
        );
        let moderatorScheduleData = scheduleResponse.data.map(
          ({
            id,
            title,
            start,
            stop,
            agent,
            moderator,
            status
          }) => ({
            id: id,
            type: "schedule",
            resourceId: moderator[0]?.id,
            title: `ID: #${id},Type: Schedule,Title :${title},Consultant:${
              agent[0].name
            },${moderator.length ? `Moderator:${moderator[0]?.name}` : ""} `,
            start: timeConvertor(
              start.slice(0, 19),
              agent[0].time_zone,
              moderator[0]?.time_zone
            ),
            end: timeConvertor(
              stop.slice(0, 19),
              agent[0].time_zone,
              moderator[0]?.time_zone
            ),
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
            user: "moderator",
          })
        );
        let combineScheduleData = [
          ...agentScheduleData,
          ...moderatorScheduleData,
        ];

        let filteredCombinedScheduleData = combineScheduleData.filter(
          (item) => {
            return item.resourceId !== undefined;
          }
        );

        console.log({
          filteredCombinedEventData,
          filteredCombinedScheduleData,
        });

        const absenceResponse = await scheduleClient.getAgentAbsence(
          id,
          start,
          end
        );

        let absenceData = absenceResponse.data.map(
          ({
            id,
            title,
            start,
            stop,
            agent,
            status
          }) => ({
            id: id,
            type: "absence",
            resourceId: agent[0].id,
            title: `Reason : ${title}`,
            start: start.slice(0, 19),
            end: stop.slice(0, 19),
            backgroundColor: setStatus(status),
            borderColor: setStatus(status),
          })
        );
        data = [...filteredCombinedEventData, ...filteredCombinedScheduleData, ...absenceData];
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
    } catch (err) {
      console.log(err);
    }
  };
};

export const eventDetailsAction = eventDetailsSlice.actions;
export const eventDetailsReducer = eventDetailsSlice.reducer;