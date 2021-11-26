import { ApiClient } from "./apiClient";
let client = new ApiClient();
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAgents() {
    return client.get(`/agent`);
  },
  getEventDetails(id, start, end) {
    return client.get(
      `/schedule-list-calendar/?search_param=&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getEventDetailsBySearch(id, search_param, start, end) {
    return client.get(
      `/schedule-list-calendar/?search_param=${search_param}&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getScheduleDetails(id, start, end) {
    return client.get(
      `/events-list-calendar/?search_param=&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
  getScheduleDetailsBySearch(id, search_param, start, end) {
    return client.get(
      `/events-list-calendar/?search_param=${search_param}&agents_list=${id}&start_date=${start}&end_date=${end}`
    );
  },
};