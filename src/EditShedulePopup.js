import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import TextField from "./TextField";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
import MultiSelector from "./MultiSelector";
import AutocompleteTextField from "./AutoComplete";
import IconButton from "@material-ui/core/IconButton";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { startTimeFormatter, endTimeFormatter } from "./Utils";
import moment from "moment";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [customersName, setCustomersName] = useState([]);

  const [agentName, setAgentName] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [scheduleType, setScheduleType] = useState({});
  const [date, setDate] = useState(moment().format("MM-DD-YYYY"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointmentSubject, setAppointmentSubject] = useState("");
  const [description, setDescription] = useState("");
  const [eventClickDetails, setEventClickDetails] = useState({});
  const [updateData, setUpdateData] = useState({});
  useEffect(() => {
    setOpen(props.open);
  }, [props]);
  useEffect(() => {
    const {
      agent,
      title,
      description,
      start,
      stop,
      schedule_type,
      customers,
    } = props.eventClickInformation;
    let startTime = start && start.slice(0, -1);
    let endTime = stop && stop.slice(0, -1);
    setEventClickDetails(props.eventClickInformation);
    setAppointmentSubject(title);
    setDescription(description);
    setStartTime(startTime);
    setEndTime(endTime);
    setDate(start);
    setAgentName(agent[0]);
    setScheduleType(schedule_type[0]);
    setCustomersName(customers);
  }, [open]);

  //handling more-less button
  const [more, setMore] = useState(false);

  const handleDateChange = (name, value) => {
    setDate(moment(value).format("MM-DD-YYYY"));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setAppointmentSubject(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleStartTimeChange = (name, value) => {
    console.log(value);
    setStartTime(moment(value).format());
  };

  const handleEndTimeChange = (name, value) => {
    console.log(value);
    setEndTime(moment(value).format());
  };
  const handleScheduleType = (e, value) => {
    setScheduleType(value);
  };

  const handleAgentName = (e, value) => {
    console.log("agetName", value);
    setAgentName(value);
  };

  const handleDelete = () => {
    props.handleDeleteEvent(eventClickDetails.id, open);
  };

  const handleButtonClick = () => {
    setUpdateData({
      id: props.eventClickInformation.id,
      agent: `${agentName.id}`,
      customers: selectedCustomers,
      schedule_type: `${scheduleType.id}`,
      title: appointmentSubject,
      description: description,
      start: startTimeFormatter(date, startTime),
      stop: endTimeFormatter(date, endTime),
    });
  };

  const callback = () => {
    props.handleUpdateData(updateData, open);
    console.log(updateData);
  };

  useEffect(() => {
    callback(updateData);
  }, [updateData]);

  const handleCustomerName = (value) => {
    console.log({ value });
    // let arr = [];
    // let userData = {};
    // for (let i = 0; i < value.length; i++) {
    //   userData = {
    //     name: value[i].name,
    //     email: value[i].email,
    //   };
    //   arr.push(userData);
    // }
    // console.log({ arr });
    // setSelectedCustomers(arr);
    setSelectedCustomers(value);
  };

  console.log({ customersName });
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{
            cursor: "move",
          }}
          id="draggable-dialog-title"
        >
          Edit Appointment
          <IconButton
            style={{ float: "right", padding: 10 }}
            aria-label="close"
            onClick={handleClose}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex" }}>
            <PersonOutlineOutlinedIcon
              style={{
                width: 28,
                height: 28,
                margin: "30px 10px 0px 0px",
                color: "#685bc7",
              }}
            />
            <div>
              <AutocompleteTextField
                label="Consultant Name*"
                options={props.consultantList}
                value={agentName}
                onChange={handleAgentName}
                placeholder="Select Consultatnt"
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <PeopleAltOutlinedIcon
              style={{
                width: 28,
                height: 28,
                margin: "30px 10px 0px 0px",
                color: "#685bc7",
              }}
            />
            <div>
              <MultiSelector
                customersName={customersName}
                onChange={handleCustomerName}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <DateRangeRoundedIcon
                style={{
                  width: 28,
                  height: 28,
                  margin: "35px 10px 0px 0px",
                  color: "#685bc7",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <DatePicker
                label="Date*"
                name="date"
                format="MM/dd/yyyy"
                value={date}
                onHandleDateChange={handleDateChange}
              />

              <TimePicker
                label="From Time*"
                name="fromTime"
                value={startTime}
                onChange={handleStartTimeChange}
              />

              <TimePicker
                label="To Time*"
                name="toTime"
                value={endTime} //"2020-02-02T09:30"
                onChange={handleEndTimeChange}
              />
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <DescriptionOutlinedIcon
              style={{
                width: 28,
                height: 28,
                margin: "35px 10px 0px 0px",
                color: "#685bc7",
              }}
            />
            <div style={{ width: "100%" }}>
              <AutocompleteTextField
                label="Appointment Type*"
                value={scheduleType}
                options={props.customerList}
                onChange={handleScheduleType}
                placeholder="Select Appointment Type"
              />
            </div>
          </div>
          <div style={{ float: "right" }}>
            <button
              onClick={() => setMore(!more)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {more ? "Less" : "More"}
            </button>
          </div>

          {more ? (
            <div style={{ marginLeft: "28px" }}>
              <TextField
                label="Subject"
                value={appointmentSubject}
                onChange={handleChange}
              />
            </div>
          ) : null}
          {more ? (
            <div style={{ marginLeft: "28px" }}>
              <TextField
                label="Description"
                multiline={true}
                rows={4}
                value={description}
                onChange={handleDescription}
              />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="secondary">
            Remove
          </Button>
          <Button
            style={{ marginRight: 15 }}
            onClick={handleButtonClick}
            color="primary"
            variant="outlined"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
