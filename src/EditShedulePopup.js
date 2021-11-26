import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import TextField from "./Components/TextField";
import MultiSelector from "./Components/MultiSelectorTextField";
import AutocompleteTextField from "./Components/AutoCompleteTextField";
import TimeZonePicker from "./Components/TimeZonePicker";
import IconButton from "@material-ui/core/IconButton";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import ScheduleRoundedIcon from "@material-ui/icons/ScheduleRounded";
import { startTimeFormatter, endTimeFormatter } from "./Utils";
import moment from "moment";
import CustomButton from "./Components/Button";
import momentTimeZone from "moment-timezone";
import { agentAvailibilityChecker } from "./Utils";
import BasicDatePicker from "./Components/BasicDatePicker";
import BasicTimePicker from "./Components/BasicTimePicker";
import Editor from "./Components/CKEditor";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} style={{ width: 700 }} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [agents, setAgents] = useState([]);
  const [customersName, setCustomersName] = useState([]);
  const [timeZone, setTimeZone] = useState("");
  const [agentName, setAgentName] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [scheduleType, setScheduleType] = useState({});
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointmentSubject, setAppointmentSubject] = useState("");
  const [description, setDescription] = useState("");
  const [eventClickDetails, setEventClickDetails] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [errorMessages, setErrorMessages] = useState({
    agentNameError: "",
    appointmentTypeError: "",
    appointmentSubjectError: "",
    customerError: "",
    timeError: "",
  });
  const [isSubmit, setIsSubmit] = useState(true);
  useEffect(() => {
    setOpen(props.open);
  }, [props]);
  useEffect(() => {
    const { agent, title, description, start, stop, schedule_type, customers } =
      props.eventClickInformation;
    let startTime = start && start.substring(0, 19);
    let endTime = stop && stop.substring(0, 19);
    setEventClickDetails(props.eventClickInformation);
    setAppointmentSubject(title);
    setDescription(description);
    setStartTime(startTime);
    setEndTime(endTime);
    setStartDate(start);
    setEndDate(stop);
    setAgentName(agent[0]);
    setScheduleType(schedule_type ? schedule_type[0] : "");
    setCustomersName(customers);
    setTimeZone(agent[0].time_zone);
  }, [open]);

  //handling more-less button
  const [more, setMore] = useState(false);

  const handleDateChange = (name, value) => {
    if (name === "start Date") {
      setStartDate(moment(value).format("YYYY-MM-DD"));
      setEndDate(moment(value).format("YYYY-MM-DD"));
    } else if (name === "end Date") {
      setEndDate(moment(value).format("YYYY-MM-DD"));
    }
  };

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

  const handleChange = (e) => {
    setErrorMessages({
      ...errorMessages,
      appointmentSubjectError: "",
    });
    setAppointmentSubject(e.target.value);
  };

  const handleDescription = (event, editor) => {
    const data = editor.getData();
    setDescription(data);
  };

  const handleTimeChange = (name, value) => {
    setErrorMessages({
      ...errorMessages,
      timeError: "",
    });
    name === "fromTime"
      ? setStartTime(moment(value).format())
      : setEndTime(moment(value).format());
  };
  const handleScheduleType = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      appointmentTypeError: "",
    });
    setScheduleType(value);
  };

  const handleAgentName = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      agentNameError: "",
    });
    setAgentName(value);
  };

  const handleDelete = () => {
    props.handleDeleteEvent(eventClickDetails.id, open);
  };

  const handleButtonClick = () => {
    // setIsSubmit(formValidator());

    setUpdateData({
      id: props.eventClickInformation.id,
      agent: `${agentName.id}`,
      customers: selectedCustomers,
      schedule_type: `${scheduleType.id}`,
      title: appointmentSubject,
      description: description,
      time_zone: timeZone,
      start: startTimeFormatter(startDate, startTime, timeZone),
      stop: endTimeFormatter(endDate, endTime, timeZone),
    });
  };

  const callback = () => {
    if (isSubmit) {
      console.log({updateData})
      props.handleUpdateData(updateData, open);
    }
  };

  useEffect(() => {
    callback(updateData);
  }, [updateData]);

  const handleCustomerName = (value) => {
    setErrorMessages({
      ...errorMessages,
      customerError: "",
    });

    setSelectedCustomers(value);
  };

  const formValidator = () => {
    let formValid = true;
    if (Object.keys(agentName).length <= 0) {
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
    if (Object.keys(scheduleType).length <= 0) {
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

    if (startTime > endTime) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        timeError: "Invalid Time",
      });
    }

    return formValid;
  };

  const handleTimePicker = (e, value) => {
    setTimeZone(value);
  };

  useEffect(() => {
    // setAgents(
    //   agentAvailibilityChecker(
    //     startDate,
    //     startTime,
    //     endTime,
    //     props.allScheduleInfo
    //   )
    // );
  }, [startDate, startTime, endTime]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        fullWidth={true}
        maxWidth="none"
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
            style={{ float: "right", padding: 5 }}
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
            <div style={{ width: "100%" }}>
              <AutocompleteTextField
                label="Consultant Name*"
                options={props.consultantList}
                value={agentName}
                disableOptions={agents}
                onChange={handleAgentName}
                placeholder="Select consultatnt"
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
            <div style={{ width: "100%" }}>
              <MultiSelector
                customersName={customersName}
                onChange={handleCustomerName}
                helperText={
                  errorMessages.customerError ? errorMessages.customerError : ""
                }
                error={errorMessages.customerError ? true : false}
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
            <div style={{ width: "100%" }}>
              <TimeZonePicker
                label="Time Zone*"
                timeZoneData={momentTimeZone.tz.names()}
                value={timeZone}
                onChange={handleTimePicker}
              />
            </div>
          </div>

          <div style={{ display: "flex", width: "100%" }}>
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
              <BasicDatePicker
                label="Start Date & Time*"
                name="start Date"
                format="MM/dd/yyyy"
                value={startDate}
                disableFrom={new Date()}
                onHandleDateChange={handleDateChange}
              />
              <BasicTimePicker
                label=""
                name="fromTime"
                value={startTime}
                onChange={handleTimeChange}
                helperText={
                  errorMessages.timeError ? errorMessages.timeError : ""
                }
                error={errorMessages.timeError ? true : false}
              />
              <div style={{ margin: "32px 0px 20px 0px" }}>-</div>
              <BasicDatePicker
                label="End Date & Time*"
                name="end Date"
                format="MM/dd/yyyy"
                value={endDate}
                disableFrom={startDate}
                onHandleDateChange={handleDateChange}
              />
              <BasicTimePicker
                name="toTime"
                value={endTime}
                onChange={handleTimeChange}
                helperText={
                  errorMessages.timeError ? errorMessages.timeError : ""
                }
                error={errorMessages.timeError ? true : false}
              />
            </div>
          </div>

          {scheduleType ? (
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
                  helperText={
                    errorMessages.appointmentTypeError
                      ? errorMessages.appointmentTypeError
                      : ""
                  }
                  error={errorMessages.appointmentTypeError ? true : false}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "40px", width: "100%" }}>
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
            <div style={{ width: "100%" }}>
              <Editor
                label="Description"
                value={description}
                onChange={handleDescription}
              />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleDelete} color="secondary">
            Remove
          </CustomButton>
          <div style={{ paddingRight: 30 }}>
            <CustomButton
              onClick={handleButtonClick}
              color="primary"
              variant="outlined"
            >
              Save Changes
            </CustomButton>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
