import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddSchedulePopup from "./AddSchedulePopup";
import EditSchedulePopup from "./EditShedulePopup";
import moment from "moment";
import timeZone from "moment-timezone";
import axios from "./axios";
import SnackBar from "./SnackBar";
import TimeZonePicker from "./Components/TimeZonePicker";

export default function FullCalendarPage() {
  const calendarRef = React.createRef();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [consultantList, setConsultantList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [creationData, setCreactionData] = useState({});
  const [updationData, setUpdation] = useState({});
  const [eventClickInfo, setEventClickInfo] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snakBarMessage, setSnackMessage] = useState("");
  const [timeZone, setTimeZone] = useState(moment.tz.guess());
  useEffect(() => {
    console.log(creationData);

    if (creationData.title) {
      axios
        .post("/schedule/", creationData)
        .then((response) => response)
        .then(() => {
          setTimeout(() => {
            setSnackOpen(true);
            setSnackMessage("New Appointment Added successfully");
          }, 1000);
        });
      loadData();
    }
  }, [creationData]);

  useEffect(() => {
    console.log(updationData);

    if (updationData.title) {
      axios
        .put(`/schedule/${updationData.id}`, updationData)
        .then((response) => response)
        .then(() => {
          setTimeout(() => {
            setSnackOpen(true);
            setSnackMessage("Appointment Updated successfully");
          }, 1000);
        });

      loadData();
    }
  }, [updationData]);

  const loadData = async () => {
    await axios
      .get("/schedule/")
      .then((response) => {
        let arr = [];

        for (let i = 0; i < response.data.length; i++) {
          let data = {
            id: response.data[i].id,
            title: response.data[i].title,
            start: response.data[i].start.slice(0, -1),
            end: response.data[i].stop.slice(0, -1),
          };
          arr.push(data);
        }
        setEventInfo(arr);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [addOpen, updationData, creationData]);

  useEffect(() => {
    axios
      .get("/agent/")
      .then((response) => {
        console.log(response);
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

  const handleDateClick = (dateClickInfo) => {
    calendarRef.current.getApi().changeView("timeGridDay", dateClickInfo.date);
    setSnackOpen(false);
  };

  const handleDateSelect = (selectInfo) => {
    setAddOpen(true);
    setSelectedInfo(selectInfo);
    setEditOpen(false);
    setSnackOpen(false);
  };

  const handleEventClick = async (clickInfo) => {
    console.log({ clickInfo });
    setAddOpen(false);
    await axios
      .get(`/schedule/${clickInfo.event.id}`)
      .then((response) => {
        console.log(response);
        setEventClickInfo(response.data);
      })
      .catch((error) => console.log(error));
    setEditOpen(true);

    setSnackOpen(false);
  };

  const handleSubmit = (submitData, open) => {
    setCreactionData(submitData);
    setAddOpen(!open);
    // setSnackMessage("New Appointment Added successfully");
    // setSnackOpen(true);
  };

  const handleUpdate = (updateData, open) => {
    console.log({ updateData });
    setUpdation(updateData);
    setEditOpen(!open);
    // setSnackMessage("Appointment Updated successfully");
    // setSnackOpen(true);
  };
  const handleDeleteEventHandler = (id, open) => {
    console.log({ id });
    axios
      .delete(`/schedule/${id}`)
      .then((response) => {
        console.log(response);
        loadData();
      })
      .then(() => {
        setTimeout(() => {
          setSnackOpen(true);
          setSnackMessage("Appointment Deleted successfully");
        }, 1000);
      })
      .catch((error) => console.log(error));
    setEditOpen(!open);
    // setSnackMessage("Appointment Deleted successfully");
    // setSnackOpen(true);
  };

  const selectDisable = (e) => {
    return moment().add(-1, "days").diff(e.start) <= 0;
  };

  const handleTimePicker = (e, value) => {
    setAddOpen(false);

    setTimeZone(value);
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #ddd",
          backgroundColor: "white",
          padding: "15px 20px 20px 20px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <div style={{ margin: "10px 0px 10px 0px" }}>
          <TimeZonePicker
            label="Change Time Zone"
            width="500"
            timeZoneData={moment.tz.names()}
            value={timeZone}
            onChange={handleTimePicker}
          />
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prevYear,prev,next,nextYear today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="timeGridDay"
        editable={false}
        selectable={true}
        selectMirror={true}
        allDaySlot={false}
        dateClick={handleDateClick}
        events={eventInfo}
        select={handleDateSelect}
        eventClick={handleEventClick}
        ref={calendarRef}
        selectAllow={selectDisable}
      />

      {addOpen &&
      moment(selectedInfo && selectedInfo.start).format("hh:mm:ss") &&
      moment(selectedInfo && selectedInfo.end).format("hh:mm:ss") !==
        "12:00:00" ? (
        <AddSchedulePopup
          open={addOpen}
          selectedInfo={selectedInfo}
          consultantList={consultantList}
          customerList={customerList}
          timeZoneData={timeZone}
          handleDataSubmit={handleSubmit}
        />
      ) : null}
      {editOpen && editOpen ? (
        <EditSchedulePopup
          open={editOpen}
          consultantList={consultantList}
          customerList={customerList}
          eventClickInformation={eventClickInfo && eventClickInfo}
          handleDeleteEvent={handleDeleteEventHandler}
          handleUpdateData={handleUpdate}
        />
      ) : null}
      {snackOpen ? (
        <SnackBar snackOpen={snackOpen} message={snakBarMessage} />
      ) : null}
    </>
  );
}
