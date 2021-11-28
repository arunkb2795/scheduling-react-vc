import moment from "moment";
import momentTimeZone from "moment-timezone";

export const startTimeFormatter = (date, time, timeZone) => {
  console.log("timezone from utils: ", { timeZone });
  let startDate = moment(date).format("YYYY-MM-DD");
  let startTime = moment(time).format("HH:mm:ss");
  let timeZoneInfo = timeZone && momentTimeZone(date).tz(timeZone).format("Z");
  let formatedStartTime = startDate + "T" + startTime + timeZoneInfo;
  return formatedStartTime;
};

export const endTimeFormatter = (date, time, timeZone) => {
  console.log("timezone from utils: ", { timeZone });
  let endDate = moment(date).format("YYYY-MM-DD");
  let endTime = moment(time).format("HH:mm:ss");
  let timeZoneInfo = timeZone && momentTimeZone(date).tz(timeZone).format("Z");
  let formatedEndTime = endDate + "T" + endTime + timeZoneInfo;
  return formatedEndTime;
};

// export const agentAvailibilityChecker = (selectedInfo, allScheduleInfo) => {
//   console.log({ selectedInfo }, { allScheduleInfo });
//   let date = moment(selectedInfo && selectedInfo.startStr).format("YYYY-MM-DD");
//   let startTime =
//     date + "T" + moment(selectedInfo && selectedInfo.startStr).format("HH:mm");
//   let endTime =
//     date + "T" + moment(selectedInfo && selectedInfo.endStr).format("HH:mm");
//   console.log(startTime, endTime);
//   const { length } = allScheduleInfo;
//   const id = length + 1;
//   const found = allScheduleInfo.some((el) => el.start === startTime);
//   if (found) {
//     console.log("true");
//   }
// };

export const agentAvailibilityChecker = (
  date,
  startTime,
  endTime,
  allScheduleInfo
) => {
  console.log({allScheduleInfo})
  let result = allScheduleInfo.filter((el) => {
    if (
      moment(startTime).isSame(moment(el.start)) ||
      moment(endTime).isSame(moment(el.end))
    ) {
      return el;
    } else if (
      moment(moment(el.start)).isSame(startTime) ||
      moment(moment(el.end)).isSame(endTime)
    ) {
      return el;
    }else if (
      moment(startTime).isSame(moment(el.end)) ||
      moment(endTime).isSame(moment(el.start))
    ) {
      return el;
    } else if (
      moment(startTime).isBetween(moment(el.start), moment(el.end)) ||
      moment(endTime).isBetween(moment(el.start), moment(el.end))
    ) {
      return el;
    } else if (
      moment(el.start).isBetween(moment(startTime), moment(endTime)) ||
      moment(el.end).isBetween(moment(startTime), moment(endTime))
    ) {
      return el;
    }
  });
  console.log("result data", { result });
  let arr = [];
  for (let i = 0; i < result.length; i++) {
    console.log("result", result[i].agent);
    arr.push(...result[i].agent);
  }
  return arr;
};
//Sun Feb 02 2020 06:30:00 GMT+0530 (India Standard Time)}
//2020-02-02T09:30
