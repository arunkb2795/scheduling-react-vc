import moment from "moment";
export const startTimeFormatter = (value) => {
  let startDate = moment(value).format("YYYY-MM-DD");
  let startTime = moment(value).format("HH:mm");
  let formatedStartTime = startDate + "T" + startTime;
  return formatedStartTime;
};

export const endTimeFormatter = (value) => {
  let endDate = moment(value).format("YYYY-MM-DD");
  let endTime = moment(value).format("HH:mm");
  let formatedEndTime = endDate + "T" + endTime;
  return formatedEndTime;
};

//Sun Feb 02 2020 06:30:00 GMT+0530 (India Standard Time)}
//2020-02-02T09:30
