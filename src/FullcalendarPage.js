import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS } from "./event-utils";
import DragabblePopup from "./DragabblePopup";
import EditSchedulePopup from "./EditShedulePopup";
import moment from "moment";
export default class FullCalendarPage extends React.Component {
  calendarRef = React.createRef();
  state = {
    currentEvents: [],
    addOpen: false,
    editOpen: false,
    data: null,
    editData: null,
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
            editable={false}
            selectable={true}
            selectMirror={true}
            // dayMaxEvents={true}
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
        {this.state.editOpen ? (
          <EditSchedulePopup
            open={this.state.editOpen}
            editData={this.state.editData}
          />
        ) : null}

        {this.state.addOpen &&
        moment(this.state.data && this.state.data.start).format("hh:mm:ss") &&
        moment(this.state.data && this.state.data.end).format("hh:mm:ss") !==
          "12:00:00" ? (
          <DragabblePopup
            open={this.state.addOpen}
            selectedInfo={this.state.data}
          />
        ) : null}
      </div>
    );
  }

  handleDateClick = (dateClickInfo) => {
    this.calendarRef.current
      .getApi()
      .changeView("timeGridDay", dateClickInfo.date);
  };

  handleDateSelect = (selectInfo) => {
    this.setState({
      addOpen: true,
      data: selectInfo,
    });
  };

  handleEventClick = (clickInfo) => {
    console.log({ clickInfo });
    let data = {
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
    };
    console.log({ data });
    this.setState({
      addOpen: false,
      editOpen: true,
      editData: data,
    });
  };
}
