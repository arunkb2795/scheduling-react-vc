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
import { getEventData, eventDetailsAction } from "./Redux/eventDetails-slice";
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
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [eventClickInfo, setEventClickInfo] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [consultantList, setConsultantList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [updationData, setUpdation] = useState({});
  const [snakBarMessage, setSnackMessage] = useState("");
  const [eventInfo, setEventInfo] = useState([]);
  const [timeZone, setTimeZone] = useState(momentTimeZone.tz.guess());

  const { agentDropdownList, resourcesList, isLoading } = useSelector(
    (state) => state.agentReducer
  );

  const { eventList, scheduleList, selectedAgent, searchText, start, end } =
    useSelector((state) => state.eventDetailsReducer);

  useEffect(() => {
    dispatch(getEventData(selectedAgent, searchText, start, end));
  }, [start, end]);

  useEffect(() => {
    dispatch(getAgentList());
  }, []);

  const loadData = async (timeZone) => {
    await axios
      .get(`/schedule/?time_zone=${timeZone}`)
      .then((response) => {
        let arr = [];

        for (let i = 0; i < response.data.length; i++) {
          let data = {
            id: response.data[i].id,
            agent: response.data[i].agent,
            title: response.data[i].title,
            start: response.data[i].start.substring(0, 19), //2020-11-26T09:00:00
            end: response.data[i].stop.substring(0, 19),
          };
          arr.push(data);
        }
        setEventInfo(arr);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadData(timeZone);
  }, [timeZone]);

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

  const handleDeleteEventHandler = (id, open) => {
    axios
      .delete(`/schedule/${id}`)
      .then((response) => {
        loadData("Asia/Calcutta");
      })
      .then(() => {
        setTimeout(() => {
          setSnackOpen(true);
          setSnackMessage("Appointment Deleted successfully");
        }, 1000);
      })
      .catch((error) => console.log(error));
    setEditOpen(!open);
  };

  const handleUpdate = (updateData, open) => {
    setUpdation(updateData);
    setEditOpen(!open);
  };

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
      dispatch(getEventData(selectedAgent, searchText, start, end));
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
    dispatch(getEventData(selectedAgent, searchText, start, end));
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  //old api
  const handleEventClick = async (clickInfo) => {
    setAddOpen(false);
    await axios
      .get(`/schedule/${clickInfo.event.id}?time_zone=Asia/Calcutta`)
      .then((response) => {
        setEventClickInfo(response.data);
      })
      .catch((error) => console.log(error));
    setEditOpen(true);

    setSnackOpen(false);
  };

  console.log({ eventClickInfo });

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
          events={[...eventList, ...scheduleList]}
        />
        {editOpen && editOpen ? (
          <EditSchedulePopup
            open={editOpen}
            consultantList={consultantList}
            customerList={customerList}
            eventClickInformation={eventClickInfo && eventClickInfo}
            handleDeleteEvent={handleDeleteEventHandler}
            handleUpdateData={handleUpdate}
            allScheduleInfo={eventInfo}
          />
        ) : null}
      </div>
    )
  );
}
