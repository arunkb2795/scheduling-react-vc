import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS } from "./event-utils";
import DragabblePopup from "./DragabblePopup";
import moment from "moment";
export default class FullCalendarPage extends React.Component {
  calendarRef = React.createRef();
  state = {
    currentEvents: [],
    setOpen: false,
    editableButton: false,
    editableTitle: "",
    data: null,
    selectable: false,
  };

  render() {
    return (
      <div>
        <div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="timeGridDay"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            allDaySlot={false}
            dateClick={this.handleDateClick}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            //eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            ref={this.calendarRef}
          />
        </div>

        {moment(this.state.data && this.state.data.start).format("hh:mm:ss") &&
        moment(this.state.data && this.state.data.end).format("hh:mm:ss") ===
          "12:00:00" ? null : (
          <DragabblePopup
            open={this.state.setOpen}
            editableTitle={this.state.editableTitle}
            selectedInfo={this.state.data}
            editable={this.state.editableButton}
          />
        )}
      </div>
    );
  }

  handleDateClick = (dateClickInfo) => {
    this.calendarRef.current
      .getApi()
      .changeView("timeGridDay", dateClickInfo.date);
  };

  handleDateSelect = (selectInfo) => {
    //console.log(moment(selectInfo.start).format("hh:mm:ss"));

    this.setState({
      setOpen: true,
      editableTitle: "",
      data: selectInfo,
      editableButton: false,
    });
  };

  handleEventClick = (clickInfo) => {
    this.setState({
      setOpen: true,
      data: clickInfo.event,
      editableButton: true,
      editableTitle: "Edit Appointment",
    });
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
      setOpen: false,
    });
  };
}
