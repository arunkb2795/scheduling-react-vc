import React, { useState, useEffect } from "react";
import FullCalendar, { createDuration } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddSchedulePopup from "./DragabblePopup";
import EditSchedulePopup from "./EditShedulePopup";
import moment from "moment";
import axios from "./axios";
import SnackBar from "./SnackBar";
import { INITIAL_EVENTS } from "./event-utils";
import { startTimeFormatter, endTimeFormatter } from "./Utils";

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
  useEffect(() => {
    console.log(creationData);

    if (creationData.title) {
      axios.post("/schedule/", creationData).then((response) => response);
      loadData();
    }
  }, [creationData]);

  useEffect(() => {
    console.log(updationData);

    if (updationData.title) {
      axios
        .put(`/schedule/${updationData.id}`, updationData)
        .then((response) => response);
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
          console.log({ arr });
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
  }, [addOpen, editOpen, creationData]);

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

  const handleEventClick = (clickInfo) => {
    console.log({ clickInfo });
    axios
      .get(`/schedule/${clickInfo.event.id}`)
      .then((response) => {
        console.log(response);
        setEventClickInfo(response.data);
      })
      .catch((error) => console.log(error));

    setAddOpen(false);
    setEditOpen(true);
    setSnackOpen(false);
  };

  const handleSubmit = (submitData, open) => {
    setCreactionData(submitData);
    setAddOpen(!open);
    setSnackOpen(true);
  };

  const handleUpdate = (updateData, open) => {
    console.log({ updateData });
    setUpdation(updateData);
    setEditOpen(!open);
  };
  const handleDeleteEventHandler = (id, open) => {
    console.log({ id });
    axios
      .delete(`/schedule/${id}`)
      .then((response) => {
        console.log(response);
        loadData();
      })
      .catch((error) => console.log(error));
    setEditOpen(!open);
    setSnackOpen(false);
  };

  return (
    <div>
      <div>
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
        />
      </div>
      {addOpen &&
      moment(selectedInfo && selectedInfo.start).format("hh:mm:ss") &&
      moment(selectedInfo && selectedInfo.end).format("hh:mm:ss") !==
        "12:00:00" ? (
        <AddSchedulePopup
          open={addOpen}
          selectedInfo={selectedInfo}
          consultantList={consultantList}
          customerList={customerList}
          handleDataSubmit={handleSubmit}
        />
      ) : null}
      {editOpen ? (
        <EditSchedulePopup
          open={editOpen}
          consultantList={consultantList}
          customerList={customerList}
          eventClickInformation={eventClickInfo}
          handleDeleteEvent={handleDeleteEventHandler}
          handleUpdateData={handleUpdate}
        />
      ) : null}
      <SnackBar snackOpen={snackOpen} />
    </div>
  );
}
