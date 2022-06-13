import { ApiClient } from "./apiClient";
let client = new ApiClient();
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAgents() {
    return client.get(`/agent`);
  },
  getScheduleDetails(id, start, end) {
    return client.get(
      `/schedule-list-calendar/?search_param=&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getScheduleDetailsBySearch(id, search_param, start, end) {
    return client.get(
      `/schedule-list-calendar/?search_param=${search_param}&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getEventDetails(id, start, end) {
    return client.get(
      `/events-list-calendar/?search_param=&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getEventDetailsBySearch(id, search_param, start, end) {
    return client.get(
      `/events-list-calendar/?search_param=${search_param}&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getScheduleById(id) {
    return client.get(`/schedule-detail-calendar/${id}`);
  },
  getEventById(id) {
    return client.get(`/events-detail-calendar/${id}`);
  },
  getAllSchedules(start, end) {
    return client.get(
      `/schedule-list-manageschedule/?start_date=${start}&end_date=${end}`
    );
  },
  getAllEvents(start, end) {
    return client.get(
      `/events-list-manageschedule/?start_date=${start}&end_date=${end}`
    );
  },
  getTimezoneList() {
    return client.get(`/get-timezone-list/`);
  },
  getAgentAbsence(id, start, end) {
    return client.get(
      `/agent-unavailability-list-calendar/?start_date=${start}&end_date=${end}`
    );
  },
};
