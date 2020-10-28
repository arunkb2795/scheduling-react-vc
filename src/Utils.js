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

//Sun Feb 02 2020 06:30:00 GMT+0530 (India Standard Time)}
//2020-02-02T09:30

export const starter = (date, time) => {
  let startDate = moment(date).format("YYYY-MM-DD");
  let startTime = moment(time).format("HH:mm");
  let formatedStartTime = startDate + "T" + startTime;
  console.log(formatedStartTime);
  return "hello";
};
