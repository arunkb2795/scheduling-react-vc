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
import TimeZonePicker from "./Components/TimeZonePicker";
import IconButton from "@material-ui/core/IconButton";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import ScheduleRoundedIcon from "@material-ui/icons/ScheduleRounded";
import moment from "moment";
import timeZone from "moment-timezone";

import { startTimeFormatter, endTimeFormatter, starter } from "./Utils";

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
  const [timeZone, setTimeZone] = useState(props.timeZoneData);
  const [more, setMore] = useState(false);
  const [date, setDate] = useState(moment().format("MM-DD-YYYY"));

  const [start, startTime] = useState(moment());
  const [end, endTime] = useState(moment());
  const [appointmentSubject, setAppointmentSubject] = useState("");
  const [description, setDescription] = useState("");

  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState([]);
  const [submitData, setSubmitData] = useState({});
  const [errorMessages, setErrorMessages] = useState({
    agentNameError: "",
    appointmentTypeError: "",
    appointmentSubjectError: "",
    customerError: "",
    timeError: "",
  });
  const [isSubmit, setIsSubmit] = useState(true);
  const handleClose = () => {
    setErrorMessages({
      agentNameError: "",
      appointmentTypeError: "",
      appointmentSubjectError: "",
      customerError: "",
      timeError: "",
    });
    setOpen(false);
  };

  const handleDateChange = (name, value) => {
    setDate(moment(value).format("MM-DD-YYYY"));
  };
  const handleChange = (e) => {
    setErrorMessages({
      ...errorMessages,
      appointmentSubjectError: "",
    });
    setAppointmentSubject(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  useEffect(() => startTime(props.selectedInfo && props.selectedInfo.start), [
    props,
  ]);
  useEffect(() => endTime(props.selectedInfo && props.selectedInfo.end), [
    props,
  ]);

  useEffect(
    () =>
      setDate(
        moment(props.selectedInfo && props.selectedInfo.startStr).format(
          "MM-DD-YYYY"
        )
      ),
    [props]
  );

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleAgentName = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      agentNameError: "",
    });
    setSelectedAgent(value);
  };
  const handleCustomerName = (value) => {
    setErrorMessages({
      ...errorMessages,
      customerError: "",
    });
    console.log("customers", { value });
    let arr = [];
    let userData = {};
    for (let i = 0; i < value.length; i++) {
      userData = {
        name: value[i].name,
        email: value[i].email,
      };
      arr.push(userData);
    }
    console.log({ arr });
    setSelectedCustomers(arr);
    //setSelectedCustomers(value);
  };

  const handleAppointmentType = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      appointmentTypeError: "",
    });
    setSelectedAppointmentType(value);
  };

  const formValidator = (
    selectedAgent,
    selectedCustomers,
    selectedAppointmentType,
    appointmentSubject,
    start,
    end
  ) => {
    let formValid = true;
    console.log({ selectedAgent });
    if (Object.keys(selectedAgent).length <= 0) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        agentNameError: "Required",
      });
    }
    if (!appointmentSubject) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        appointmentSubjectError: "Required",
      });
    }
    if (Object.keys(selectedAppointmentType).length <= 0) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        appointmentTypeError: "Required",
      });
    }
    if (selectedCustomers.length <= 0) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        customerError: "Required",
      });
    }

    if (start > end) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        timeError: "Invalid Time",
      });
    }

    return formValid;
  };

  const handleButtonClick = () => {
    setIsSubmit(
      formValidator(
        selectedAgent,
        selectedCustomers,
        selectedAppointmentType,
        appointmentSubject,
        start,
        end
      )
    );
    //console.log(values);
    setSubmitData({
      agent: `${selectedAgent.id}`,
      customers: selectedCustomers,
      schedule_type: `${selectedAppointmentType.id}`,
      title: appointmentSubject,
      description: description,
      start: startTimeFormatter(date, start),
      stop: endTimeFormatter(date, end),
    });
  };

  const callback = () => {
    //console.log({ isSubmit });
    if (isSubmit) {
      props.handleDataSubmit(submitData, open);
    }
    console.log(submitData);
  };

  useEffect(() => {
    callback(submitData);
  }, [submitData]);

  const handleTimeChange = (name, value) => {
    setErrorMessages({
      ...errorMessages,
      timeError: "",
    });
    name === "fromTime" ? startTime(value) : endTime(value);
    console.log(name, value);
  };

  let output = starter(date, start);
  console.log(output);

  const handleTimePicker = (e, value) => {
    setTimeZone(value);
  };

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
          Add Appointment
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
                onChange={handleAgentName}
                placeholder="Select consultant"
                helperText={errorMessages.agentNameError}
                error={errorMessages.agentNameError ? true : false}
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
                helperText={
                  errorMessages.customerError ? errorMessages.customerError : ""
                }
                error={errorMessages.customerError ? true : false}
                onChange={handleCustomerName}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <ScheduleRoundedIcon
              style={{
                width: 28,
                height: 28,
                margin: "30px 10px 0px 0px",
                color: "#685bc7",
              }}
            />
            <div>
              <TimeZonePicker
                label="Time Zone*"
                timeZoneData={moment.tz.names()}
                value={timeZone}
                onChange={handleTimePicker}
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
                value={start}
                onChange={handleTimeChange}
                helperText={
                  errorMessages.timeError ? errorMessages.timeError : ""
                }
                error={errorMessages.timeError ? true : false}
              />

              <TimePicker
                label="To Time*"
                name="toTime"
                value={end}
                onChange={handleTimeChange}
                helperText={
                  errorMessages.timeError ? errorMessages.timeError : ""
                }
                error={errorMessages.timeError ? true : false}
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
                options={props.customerList}
                onChange={handleAppointmentType}
                placeholder="Select appointment type"
                helperText={
                  errorMessages.appointmentTypeError
                    ? errorMessages.appointmentTypeError
                    : ""
                }
                error={errorMessages.appointmentTypeError ? true : false}
              />
            </div>
          </div>
          <div style={{ marginLeft: "28px" }}>
            <TextField
              label="Appointment Title*"
              value={appointmentSubject}
              onChange={handleChange}
              placeholder="Type appointment title here"
              helperText={
                errorMessages.appointmentSubjectError
                  ? errorMessages.appointmentSubjectError
                  : ""
              }
              error={errorMessages.appointmentSubjectError ? true : false}
            />
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
          <Button onClick={handleClose} color="primary">
            Close
          </Button>

          <Button
            style={{ marginRight: 15 }}
            onClick={handleButtonClick}
            color="primary"
            variant="outlined"
            //disabled={!isSubmit}
          >
            Create appointment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
