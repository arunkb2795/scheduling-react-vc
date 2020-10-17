let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: 78,
    title: "Demo",
    description: "test",
    start: "2020-10-13T09:00:00",
    end: "2020-10-13T10:00:00",
    status: "Upcoming",
  },
];

export function createEventId() {
  return String(eventGuid++);
}
