import moment from "moment";
export const startTimeFormatter = (date, time) => {
  let startDate = moment(date).format("YYYY-MM-DD");
  let startTime = moment(time).format("HH:mm");
  let formatedStartTime = startDate + "T" + startTime;
  return formatedStartTime;
};

export const endTimeFormatter = (date, time) => {
  let endDate = moment(date).format("YYYY-MM-DD");
  let endTime = moment(time).format("HH:mm");
  let formatedEndTime = endDate + "T" + endTime;
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
  console.log({ date }, { startTime }, { endTime }, { allScheduleInfo });
  let result = allScheduleInfo.filter((el) => {
    // if (el.start === startTime + ":00" || el.end === endTime + ":00") {
    //   return el;
    // }

    if (
      moment(startTime).isSame(moment(el.start)) ||
      moment(endTime).isSame(moment(el.end))
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
  console.log(result);
  let arr = [];
  for (let i = 0; i < result.length; i++) {
    console.log("data", result[i].agent);
    arr.push(...result[i].agent);
  }
  console.log("agents", { arr });

  return arr;
};
//Sun Feb 02 2020 06:30:00 GMT+0530 (India Standard Time)}
//2020-02-02T09:30
