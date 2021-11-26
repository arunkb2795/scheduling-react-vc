import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { useSelector, useDispatch } from "react-redux";
import { getAgentList } from "./Redux/agent-slice";
import {
  getCalenderEvents,
  eventDetailsAction,
} from "./Redux/eventDetails-slice";
import { getAppointment } from "./Redux/appointment-slice";
import SearchBox from "./Components/SearchBox";
import MultiSelect from "./Components/MultiSelect";
import AddSchedulePopup from "./AddSchedulePopup";
import EditSchedulePopup from "./EditShedulePopup";
import moment from "moment";
import momentTimeZone from "moment-timezone";
import axios from "./api/axios";
import SnackBar from "./Components/SnackBar";
import TimeZonePicker from "./Components/TimeZonePicker";

export default function FullCalendarPage() {
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const [consultantList, setConsultantList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  const { agentDropdownList, resourcesList, isLoading } = useSelector(
    (state) => state.agentReducer
  );

  const { events, selectedAgent, searchText, start, end } = useSelector(
    (state) => state.eventDetailsReducer
  );

  useEffect(() => {
    axios
      .get("/agent/")
      .then((response) => {
        setConsultantList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get("/schedule_type/")
      .then((response) => {
        setCustomerList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    dispatch(getCalenderEvents(selectedAgent, searchText, start, end));
  }, [start, end]);

  useEffect(() => {
    dispatch(getAgentList());
  }, []);

  useEffect(() => {
    if (agentDropdownList.length > 0) {
      let agentId = agentDropdownList.filter((agent) => {
        return window.signed_in_user_email === agent.email;
      });
      dispatch(eventDetailsAction.setSelectedAgent(agentId[0]?.value));
    }
  }, [agentDropdownList]);

  useEffect(() => {
    if (!window.is_admin && selectedAgent) {
      dispatch(getCalenderEvents(selectedAgent, searchText, start, end));
    }
  }, [selectedAgent]);

  const handleSelectedDate = (data) => {
    dispatch(
      eventDetailsAction.setDate({
        start: moment(data.start).format("YYYY-MM-DD"),
        end: moment(data.end).format("YYYY-MM-DD"),
      })
    );
  };

  const handleSearchChange = (e) => {
    dispatch(eventDetailsAction.setSearchText(e.target.value));
  };

  const handleSearchClick = () => {
    dispatch(getCalenderEvents(selectedAgent, searchText, start, end));
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleEventClick = async (eventInfo) => {
    let type = eventInfo.event._def.extendedProps.type;
    let id = eventInfo.event.id;
    setEditOpen(true);
    dispatch(eventDetailsAction.setType(type));
    dispatch(getAppointment(id, type));
  };

  const handleClose = () => {
    setEditOpen(false);
  };

  return (
    !isLoading && (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ minWidth: "500px", padding: "20px 20px 20px 0" }}>
            {window.is_admin ? (
              <MultiSelect options={agentDropdownList} />
            ) : null}
          </div>
          <div style={{ padding: "20px 0px" }}>
            <SearchBox
              handleChange={handleSearchChange}
              handleSearchClick={handleSearchClick}
              handleKeydown={handleKeydown}
            />
          </div>
        </div>
        <FullCalendar
          plugins={[
            adaptivePlugin,
            interactionPlugin,
            dayGridPlugin,
            listPlugin,
            timeGridPlugin,
            resourceTimelinePlugin,
            resourceTimeGridPlugin,
          ]}
          datesSet={handleSelectedDate}
          eventClick={handleEventClick}
          allDaySlot={false}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          // now="2018-02-07"
          editable={true} // enable draggable events
          aspectRatio={1.8}
          scrollTime={"06:00"} // undo default 6am scrollTime
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "resourceTimeGridDay,timeGridWeek,dayGridMonth,listWeek",
          }}
          initialView={"resourceTimeGridDay"}
          resources={resourcesList}
          events={events}
          // select={handleDateSelect}
          editable={false}
          selectable={true}
          selectMirror={true}
        />
        {editOpen && (
          <EditSchedulePopup
            open={editOpen}
            handleClose={handleClose}
            consultantList={consultantList}
            customerList={customerList}
            // eventClickInformation={eventClickInfo && eventClickInfo}
            // handleDeleteEvent={handleDeleteEventHandler}
            // handleUpdateData={handleUpdate}
            // allScheduleInfo={eventInfo}
          />
        )}
      </div>
    )
  );
}
