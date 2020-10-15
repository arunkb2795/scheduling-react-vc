let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Title 3",
    start: "2020-10-08T17:41:03Z",
    end: "2020-10-08T17:41:10Z",
  },
  {
    id: 2,
    title: "Title 4",
    start: "2020-10-09T17:41:03Z",
    end: "2020-10-09T17:41:10Z",
  },
  {
    id: 3,
    title: "Title 4",
    start: "2020-10-09T17:41:03Z",
    end: "2020-10-09T19:41:10Z",
  },
  {
    id: 4,
    title: "Title 4",
    start: "2020-10-09T09:00:03Z",
    end: "2020-10-09T10:00:10Z",
  },
];

export function createEventId() {
  return String(eventGuid++);
}
