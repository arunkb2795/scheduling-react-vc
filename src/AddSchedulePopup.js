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
import moment from "moment";
import momentTz from "moment-timezone";
import CustomButton from "./Components/Button";
import { startTimeFormatter, endTimeFormatter } from "./Utils";
import BasicDatePicker from "./Components/BasicDatePicker";
import BasicTimePicker from "./Components/BasicTimePicker";
import Editor from "./Components/CKEditor";
import TimezoneList from "./Utils/TimezoneList";
import axios from "./api/axios";
import WarningMessage from "./Components/WarningMessage";

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
  const {
    open,
    handleClose,
    consultantList,
    timezoneList,
    scheduleList,
    selectedInfo,
    handleDataSubmit,
    allScheduleInfo,
    disableButton,
  } = props;

  const [agents, setAgents] = useState([]);
  const [moderatorList, setModeratorList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [scheduleListData, setScheduleList] = useState([]);
  const [selectedModerator, setSelectedModerator] = useState({});
  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedTimeZone, setSelectedTimeZone] = useState();
  const [timeZone, setTimeZone] = useState("");
  const [more, setMore] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [start, startTime] = useState(moment());
  const [end, endTime] = useState(moment());
  const [appointmentSubject, setAppointmentSubject] = useState("");
  const [description, setDescription] = useState("");
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
  const [isWarning, setIsWarning] = useState(true);
  const [isDisableSchedule, setIsDisableSchedule] = useState(true);

  const [isSubmit, setIsSubmit] = useState(true);

  // const handleClose = () => {
  //   setErrorMessages({
  //     agentNameError: "",
  //     appointmentTypeError: "",
  //     appointmentSubjectError: "",
  //     customerError: "",
  //     timeError: "",
  //   });
  // };

  const handleDateChange = (name, value) => {
    if (name === "start Date") {
      setStartDate(moment(value).format("YYYY-MM-DD"));
      setEndDate(moment(value).format("YYYY-MM-DD"));
    } else if (name === "end Date") {
      setEndDate(moment(value).format("YYYY-MM-DD"));
    }
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

  useEffect(() => {
    setAgentList(consultantList);
    setModeratorList(consultantList);
  }, []);

  useEffect(() => {
    startTime(selectedInfo?.start);
    endTime(selectedInfo?.end);
    setStartDate(moment(selectedInfo?.startStr).format("YYYY-MM-DD"));
    setEndDate(moment(selectedInfo?.startStr).format("YYYY-MM-DD"));
  }, [selectedInfo]);

  useEffect(() => {
    if (selectedAgent.id) {
      let data = {
        agent: selectedAgent.id,
        start: startTimeFormatter(startDate, start, timeZone.value),
        stop: endTimeFormatter(endDate, end, timeZone.value),
      };
      setIsDisableSchedule(true);
      axios
        .post("/check-agent-availability/", data)
        .then((response) => {
          setIsWarning(response.data);
          setIsDisableSchedule(false);
        })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedAgent, startDate, start, endDate, end]);

  const handleAgentChange = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      agentNameError: "",
    });
    setSelectedAgent(value);
    let agentTimezone =timezoneList.filter(
      (item) => item.value === value.time_zone
    );
    setTimeZone(agentTimezone[0]);
    let data = consultantList.filter((item) => item.id !== value.id);
    setModeratorList(data);
    setSelectedAppointmentType([]);
    let scheduleArray = consultantList.filter((item) => item.id === value.id);
    setScheduleList(scheduleArray[0].schedule_types);
  };

  const handleModeratorChange = (e, value) => {
    setSelectedModerator(value);
    let data = consultantList.filter((item) => item.id !== value.id);
    setAgentList(data);
  };

  const handleCustomerName = (value) => {
    setErrorMessages({
      ...errorMessages,
      customerError: "",
    });
    let arr = [];
    let userData = {};
    for (let i = 0; i < value.length; i++) {
      userData = {
        name: value[i].name,
        email: value[i].email,
        time_zone: value[i].time_zone,
        phone: value[i].phone,
      };
      arr.push(userData);
    }
    setSelectedCustomers(arr);
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

    if (moment(start).isAfter(moment(end))) {
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
        startTimeFormatter(startDate, start, timeZone.value),
        endTimeFormatter(endDate, end, timeZone.value)
      )
    );
    setSubmitData({
      agent: `${selectedAgent.id}`,
      moderator: selectedModerator.id ? `${selectedModerator.id}` : "",
      customers: selectedCustomers,
      schedule_type: `${selectedAppointmentType.id}`,
      title: appointmentSubject,
      description: description,
      start: startTimeFormatter(startDate, start, timeZone.value),
      stop: endTimeFormatter(endDate, end, timeZone.value),
      time_zone: selectedCustomers[0].time_zone,
    });
  };

  const callback = () => {
    if (isSubmit) {
      handleDataSubmit(submitData);
    }
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
  };

  const handleTimezoneChange = (e, value) => {
    setTimeZone(value);
  };

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
          Add Appointment
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
                options={agentList}
                value={selectedAgent}
                onChange={handleAgentChange}
                placeholder="Select consultant"
                helperText={errorMessages.agentNameError}
                error={errorMessages.agentNameError ? true : false}
              />
            </div>
          </div>
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
                label="Moderator Name"
                options={moderatorList}
                onChange={handleModeratorChange}
                placeholder="Select moderator"
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
            <div style={{ width: "100%" }}>
              <TimeZonePicker
                label="Time Zone*"
                options={timezoneList}
                value={timeZone}
                onChange={handleTimezoneChange}
                disabled={true}
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
                value={start}
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
                label=""
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
          {!isWarning && <WarningMessage />}
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
                options={scheduleListData}
                value={selectedAppointmentType}
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
              <Editor label="Description" onChange={handleDescription} />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleClose} color="primary">
            Close
          </CustomButton>

          <div style={{ paddingRight: 30 }}>
            <CustomButton
              onClick={handleButtonClick}
              color="primary"
              variant="outlined"
              disabled={disableButton || isDisableSchedule}
            >
              Create appointment
            </CustomButton>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
