import React, { useState, useEffect,useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
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
import axios from "./api/axios";
import SnackBar from "./Components/SnackBar";
import TimeZonePicker from "./Components/TimeZonePicker";
import TimezoneList from "./Utils/TimezoneList";
import momentTZ from "moment-timezone";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./styles.module.scss";
import { TimezoneContext } from "./context/TimezoneContext";


export default function FullCalendarPage() {
  const dispatch = useDispatch();
  const calendarRef = React.createRef();
  const timezoneData = useContext(TimezoneContext);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [consultantList, setConsultantList] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
  const [eventClickInfo, setEventClickInfo] = useState({});
  const [calendarView, setCalenderView] = useState("resourceTimeGridDay");
  const [disableButton, setDisableButton] = useState(false);

  const { agentDropdownList, resourcesList, isLoading } = useSelector(
    (state) => state.agentReducer
  );

  console.log({ resourcesList });

  const {
    events,
    selectedAgent,
    type,
    start,
    end,
    isLoadingSchedule = true,
  } = useSelector((state) => state.eventDetailsReducer);

  useEffect(() => {
    let x = document.getElementsByClassName("fc-button-group");
    if (x.length > 0) {
      if (isLoadingSchedule && !isLoading) {
        document.getElementsByClassName(
          "fc-button-group"
        )[0].style.pointerEvents = "none";

        document.getElementsByClassName(
          "fc-button-group"
        )[1].style.pointerEvents = "none";
      } else {
        document.getElementsByClassName(
          "fc-button-group"
        )[0].style.pointerEvents = "all";

        document.getElementsByClassName(
          "fc-button-group"
        )[1].style.pointerEvents = "all";
      }
    }
  }, [isLoadingSchedule, isLoading]);

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
        setScheduleList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (window.is_admin) {
      let id = null;
      dispatch(getCalenderEvents(id, start, end));
    }
  }, [start, end]);

  useEffect(() => {
    if (!window.is_admin) {
      if (agentDropdownList.length > 0) {
        let agent = agentDropdownList.filter((agent) => {
          return window.signed_in_user_email === agent.email;
        });
        let id = agent[0].value;
        console.log("agent id", agent);
        dispatch(getCalenderEvents(id, start, end));
      }
    }
  }, [agentDropdownList, start, end]);

  useEffect(() => {
    dispatch(getAgentList());
  }, []);

  // useEffect(() => {
  //   if (agentDropdownList.length > 0) {
  //     let agentId = agentDropdownList.filter((agent) => {
  //       return window.signed_in_user_email === agent.email;
  //     });
  //     dispatch(eventDetailsAction.setSelectedAgent(agentId[0]?.value));
  //   }
  // }, [agentDropdownList]);

  // useEffect(() => {
  //   if (!window.is_admin && selectedAgent) {
  //     dispatch(getCalenderEvents(start, end));
  //   }
  // }, [selectedAgent]);

  const handleSelectedDate = (data) => {
    setCalenderView(data?.view?.type);
    dispatch(
      eventDetailsAction.setDate({
        start: moment(data.start).format("YYYY-MM-DD"),
        end: moment(data.end).format("YYYY-MM-DD"),
      })
    );
  };

  const handleEventClick = async (eventInfo) => {
    console.log(eventInfo);
    let user = eventInfo.event._def.extendedProps.user;
    if (user === "agent") {
      let type = eventInfo.event._def.extendedProps.type;
      let id = eventInfo.event.id;
      setEventClickInfo(eventInfo);
      setEditOpen(true);
      dispatch(eventDetailsAction.setType(type));
      dispatch(getAppointment(id, type));
    } else if (user === "moderator") {
      toast.error("Sorry! Moderator view is not editable.");
    }
  };

  const handleDateSelect = (selectInfo) => {
    setAddOpen(true);
    setSelectedInfo(selectInfo);
  };

  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
  };

  const handleDateClick = (dateClickInfo) => {
    calendarRef.current
      .getApi()
      .changeView("resourceTimeGridDay", dateClickInfo.date);
  };

  const setStatus = (status) => {
    if (status === "Completed") {
      return "#28a745";
    } else if (status === "Cancelled") {
      return "#dc3545";
    } else if (status === "No Show") {
      return "#707070";
    } else if (status === "Coc Violation") {
      return "#FFFF00";
    } else if (status === "Incomplete") {
      return "#999900";
    } else if (
      status === "Upcoming" ||
      status === "Rescheduled" ||
      status === "New"
    ) {
      return "#685bc7";
    }
  };

  const handleSubmit = (submitData) => {
    console.log({ submitData });

    if (submitData.title) {
      setDisableButton(true);

      axios
        .post("/schedule/", submitData)
        .then((response) => {
          if (response.data) {
            let arr = [...events];
            let data = {
              id: response.data.id,
              type: "schedule",
              resourceId: response.data.agent[0].id,
              title: response.data.title,
              start: response.data.start.substring(0, 19),
              end: response.data.stop.substring(0, 19),
              backgroundColor: setStatus(response.data.status),
              borderColor: setStatus(response.data.status),
              user: "agent",
            };
            arr.push(data);
            dispatch(eventDetailsAction.setCalenderEvents(arr));
          }
        })
        .then(() => {
          setDisableButton(false);
          toast.success("appointment added successfully");
          dispatch(getCalenderEvents(null, start, end));
          setAddOpen(false);
        })
        .catch((err) => {
          setDisableButton(false);
          toast.error("Sorry! Consultant is not available on this time-slot");
          console.log(err);
        });
    }
  };

  const handleUpdate = (updateData, type) => {
    if (updateData.title) {
      if (type === "schedule") {
        axios
          .put(`/schedule/${updateData.id}`, updateData)
          .then((response) => {
            if (response.data) {
              let data = {
                id: response.data.id,
                type: "schedule",
                resourceId: response.data.agent[0].id,
                agent: response.data.agent,
                title: response.data.title,
                start: response.data.start.substring(0, 19), //2020-11-26T09:00:00
                end: response.data.stop.substring(0, 19),
                user: "agent",
              };
              const elementsIndex = events.findIndex(
                (element) => element.id == updateData.id
              );
              let newArray = [...events];
              newArray[elementsIndex] = data;
              dispatch(eventDetailsAction.setCalenderEvents(newArray));
            }
          })
          .then(() => {
            toast.success("appointment updated successfully");
            dispatch(getCalenderEvents(null, start, end));
            setEditOpen(false);
          })
          .catch((err) => {
            toast.error("Sorry! Consultant is not available on this time-slot");
            console.log(err);
          });
      } else if (type === "event") {
        axios
          .put(`/events/${updateData.id}`, updateData)
          .then((response) => {
            if (response.data) {
              let data = {
                id: response.data.id,
                type: "event",
                resourceId: response.data.agent[0].id,
                agent: response.data.agent,
                title: response.data.title,
                start: response.data.start.substring(0, 19), //2020-11-26T09:00:00
                end: response.data.stop.substring(0, 19),
              };
              const elementsIndex = events.findIndex(
                (element) => element.id == updateData.id
              );
              let newArray = [...events];
              newArray[elementsIndex] = data;
              dispatch(eventDetailsAction.setCalenderEvents(newArray));
            }
          })
          .then(() => {
            toast.success("appointment updated successfully");
            dispatch(getCalenderEvents(null, start, end));
            setEditOpen(false);
          })
          .catch((err) => {
            toast.error("Sorry! Consultant is not available on this time-slot");
            console.log(err);
          });
      }
    }
  };

  const handleDeleteEventHandler = (id, type) => {
    console.log({ type });
    if (type === "schedule") {
      axios
        .delete(`/schedule/${id}`)
        .then((response) => {
          if (!response.data) {
            let newArray = [...events];
            let data = newArray.filter((item) => item.id !== parseInt(id));
            dispatch(eventDetailsAction.setCalenderEvents(data));
          }
        })
        .then(() => {
          setEditOpen(false);
          toast.success("appointment deleted successfully");
        })
        .catch((error) => {
          toast.error("Something went wrong!");
          console.log(error);
        });
    } else if (type === "event") {
      axios
        .delete(`/events/${id}`)
        .then((response) => {
          if (!response.data) {
            let newArray = [...events];
            let data = newArray.filter((item) => item.id !== parseInt(id));
            dispatch(eventDetailsAction.setCalenderEvents(data));
          }
        })
        .then(() => {
          setEditOpen(false);
          toast.success("appointment deleted successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong!");
        });
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  return (
    !isLoading && (
      <div>
        {isLoadingSchedule && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <p style={{ paddingTop: "3px" }}>Loading...</p>
            <CircularProgress size={30} />
          </div>
        )}
        <FullCalendar
          plugins={[
            adaptivePlugin,
            interactionPlugin,
            dayGridPlugin,
            listPlugin,
            timeGridPlugin,
            resourceTimelinePlugin,
            resourceTimeGridPlugin,
            scrollGridPlugin,
          ]}
          resourceOrder={"type"}
          ref={calendarRef}
          dateClick={handleDateClick}
          datesSet={handleSelectedDate}
          eventClick={handleEventClick}
          allDaySlot={false}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          // now="2018-02-07"
          slotDuration={"00:15:00"}
          editable={true} // enable draggable events
          aspectRatio={1.8}
          scrollTime={"06:00"} // undo default 6am scrollTime
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: window.is_admin
              ? "resourceTimeGridDay,timeGridWeek,dayGridMonth,listYear"
              : "timeGridDay,timeGridWeek,dayGridMonth,listYear",
          }}
          initialView={window.is_admin ? "resourceTimeGridDay" : "timeGridDay"}
          resources={resourcesList}
          events={events}
          select={handleDateSelect}
          editable={false}
          selectable={true}
          selectMirror={true}
          // height="auto"
          dayMinWidth={calendarView === "resourceTimeGridDay" ? 320 : undefined}
        />

        <div className={styles.dot}>
          <div className={styles.dotItems}>
            <p className={styles.completed}></p>
            <p className={styles.text}>Completed</p>
          </div>
          <div className={styles.dotItems}>
            <p className={styles.cancelled}></p>
            <p className={styles.text}>Cancelled</p>
          </div>
          <div className={styles.dotItems}>
            <p className={styles.noShow}></p>
            <p className={styles.text}>No Show</p>
          </div>
          <div className={styles.dotItems}>
            <p className={styles.coc_violation}></p>
            <p className={styles.text}>Coc Violation</p>
          </div>
          <div className={styles.dotItems}>
            <p className={styles.inComplete}></p>
            <p className={styles.text}>Incomplete</p>
          </div>
          <div className={styles.dotItems}>
            <p className={styles.upComing}></p>
            <p className={styles.text}>Upcoming/Reschedule/New</p>
          </div>
        </div>

        {addOpen && (
          <AddSchedulePopup
            open={addOpen}
            handleClose={handleClose}
            selectedInfo={selectedInfo}
            consultantList={consultantList}
            scheduleList={scheduleList}
            timezoneList={timezoneData}
            // customerList={customerList}
            // timeZoneData={timeZone}
            handleDataSubmit={handleSubmit}
            allScheduleInfo={events}
            disableButton={disableButton}
          />
        )}
        {editOpen && (
          <EditSchedulePopup
            open={editOpen}
            handleClose={handleClose}
            consultantList={consultantList}
            // customerList={customerList}
            scheduleList={scheduleList}
            timezoneList={timezoneData}
            eventClickInfo={eventClickInfo && eventClickInfo}
            handleDeleteEvent={(id, type) => handleDeleteEventHandler(id, type)}
            handleUpdateData={handleUpdate}
            // allScheduleInfo={eventInfo}
          />
        )}
        <ToastContainer />
      </div>
    )
  );
}
