import moment from "moment";
export const startTimeFormatter = (value) => {
  const startDate = moment(value).format("L");
  const startTime = moment(value).format("L");
  return [startDate, startTime];
};

//Sun Feb 02 2020 06:30:00 GMT+0530 (India Standard Time)}
//2020-02-02T09:30
