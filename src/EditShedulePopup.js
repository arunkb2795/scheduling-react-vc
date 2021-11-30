import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { useSelector } from "react-redux";
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
import momentTz from "moment-timezone";
import { agentAvailibilityChecker } from "./Utils";
import BasicDatePicker from "./Components/BasicDatePicker";
import BasicTimePicker from "./Components/BasicTimePicker";
import Editor from "./Components/CKEditor";
import TimezoneList from "./Utils/TimezoneList";
const DEFAULT_TIMEZONE = momentTz.tz.guess();

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
  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedModerator, setSelectedModerator] = useState({});
  const [moderatorList, setModeratorList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(moment());
  const [selectedEndTime, setSelectedEndTime] = useState(moment());
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [appointmentSubject, setAppointmentSubject] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [type, setType] = useState(null);

  // const [agents, setAgents] = useState([]);
  // const [customersName, setCustomersName] = useState([]);
  // const [timeZone, setTimeZone] = useState("");
  // const [agentName, setAgentName] = useState({});
  // const [selectedCustomers, setSelectedCustomers] = useState([]);
  // const [scheduleType, setScheduleType] = useState({});
  // const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  // const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");

  // const [eventClickDetails, setEventClickDetails] = useState({});
  // const [updateData, setUpdateData] = useState({});
  //handling more-less button
  const [more, setMore] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    agentNameError: "",
    appointmentTypeError: "",
    appointmentSubjectError: "",
    customerError: "",
    timeError: "",
  });
  const [isSubmit, setIsSubmit] = useState(true);

  const [time_zone, selectedTimeZone] = useState([]);

  const {
    agent,
    customers,
    moderator,
    timeZone,
    startTime,
    endTime,
    title,
    description,
    schedule_type,
    appointmentLoading,
  } = useSelector((state) => state.appointmentReducer);

  const {
    consultantList,
    scheduleList,
    open,
    handleClose,
    timezoneList,
    handleDeleteEvent,
    eventClickInfo,
    handleUpdateData,
  } = props;

  useEffect(() => {
    if (!appointmentLoading && agent[0]) {
      setSelectedAgent(agent[0]);
      setSelectedModerator(moderator.length ? moderator[0] : {});
      setAgentList(consultantList);
      setModeratorList(consultantList);
      setSelectedAppointmentType(schedule_type[0]);
      setSelectedDescription(description);
      setSelectedStartTime(startTime.substring(0, 19));
      setSelectedEndTime(endTime.substring(0, 19));
      setSelectedStartDate(moment(startTime).format("YYYY-MM-DD"));
      setSelectedEndDate(moment(endTime).format("YYYY-MM-DD"));
      setAppointmentSubject(title);
      setType(eventClickInfo.event._def.extendedProps.type);
      if (timeZone) {
        let defaultTimezone = TimezoneList().filter(
          (item) => item.value === timeZone
        );
        selectedTimeZone(defaultTimezone[0] ?? TimezoneList()[33]);
      }

      // if (timeZone) {
      //   let defaultTimezone = TimezoneList().filter(
      //     (item) => item.value === timeZone
      //   );
      //   selectedTimeZone(defaultTimezone[0] ?? TimezoneList()[33]);
      // } else {
      //   let defaultTimezone = TimezoneList().filter(
      //     (item) => item.value === DEFAULT_TIMEZONE
      //   );
      //   selectedTimeZone(defaultTimezone[0] ?? TimezoneList()[33]);
      // }
    }
  }, [appointmentLoading]);

  // useEffect(() => {

  //   // if (moderator.length) {
  //   //   let data = consultantList.filter((item) => item.id !== moderator[0].id);

  //   //   setAgentList(data);
  //   // } else {
  //   //   setAgentList(consultantList);
  //   // }
  //   // if (agent[0]) {
  //   //   let data = consultantList.filter((item) => item.id !== agent[0].id);
  //   //   setModeratorList(data);
  //   // }
  // }, [timeZone]);

  const handleAgentChange = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      agentNameError: "",
    });
    setSelectedAgent(value);
    let agentTimezone = TimezoneList().filter(
      (item) => item.value === value.time_zone
    );
    selectedTimeZone(agentTimezone[0]);
    let data = consultantList.filter((item) => item.id !== value.id);
    setModeratorList(data);
  };

  const handleModeratorChange = (e, value) => {
    setErrorMessages({
      ...errorMessages,
      agentNameError: "",
    });
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

  const handleTimeChange = (name, value) => {
    setErrorMessages({
      ...errorMessages,
      timeError: "",
    });
    name === "fromTime"
      ? setSelectedStartTime(value)
      : setSelectedEndTime(value);
  };

  const handleTimezoneChange = (e, value) => {
    selectedTimeZone(value);
  };

  const handleDateChange = (name, value) => {
    if (name === "start Date") {
      setSelectedStartDate(moment(value).format("YYYY-MM-DD"));
      setSelectedEndDate(moment(value).format("YYYY-MM-DD"));
    } else if (name === "end Date") {
      setSelectedEndDate(moment(value).format("YYYY-MM-DD"));
    }
  };

  const handleAppointmentSubject = (e) => {
    setErrorMessages({
      ...errorMessages,
      appointmentSubjectError: "",
    });
    setAppointmentSubject(e.target.value);
  };

  const handleDescription = (event, editor) => {
    const data = editor.getData();
    setSelectedDescription(data);
  };

  const formValidator = () => {
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
    if (selectedAppointmentType && type === "schedule") {
      if (
        Object.keys(selectedAppointmentType).length <= 0 &&
        type === "schedule"
      ) {
        formValid = false;
        setErrorMessages({
          ...errorMessages,
          appointmentTypeError: "Required",
        });
      }
    }
    if (selectedCustomers.length <= 0) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        customerError: "Required",
      });
    }

    if (!moment(selectedStartTime).isBefore(moment(selectedEndTime))) {
      formValid = false;
      setErrorMessages({
        ...errorMessages,
        timeError: "Invalid Time",
      });
    }

    return formValid;
  };

  const handleButtonClick = () => {
    setIsSubmit(formValidator());
    setUpdateData({
      id: eventClickInfo.event.id,
      agent: `${selectedAgent.id}`,
      moderator: `${selectedModerator.id}`,
      customers: selectedCustomers,
      schedule_type: selectedAppointmentType
        ? `${selectedAppointmentType.id}`
        : null,
      title: appointmentSubject,
      description: selectedDescription,
      time_zone: time_zone.value,
      start: startTimeFormatter(
        selectedStartDate,
        selectedStartTime,
        time_zone.value
      ),
      stop: endTimeFormatter(selectedEndDate, selectedEndTime, time_zone.value),
    });
  };

  const callback = () => {
    if (isSubmit) {
      handleUpdateData(updateData, type);
      //   props.handleUpdateData(updateData, open);
    }
  };

  useEffect(() => {
    callback(updateData);
  }, [updateData]);

  return (
    !appointmentLoading &&
    agent.length && (
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
                  options={agentList}
                  value={selectedAgent}
                  // disableOptions={agents}
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
                  label="Moderator Name*"
                  options={moderatorList}
                  value={selectedModerator}
                  // disableOptions={agents}
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
                  customersName={customers}
                  onChange={handleCustomerName}
                  helperText={
                    errorMessages.customerError
                      ? errorMessages.customerError
                      : ""
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
                  options={timezoneList}
                  value={time_zone}
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
                  value={selectedStartDate}
                  disableFrom={new Date()}
                  onHandleDateChange={handleDateChange}
                />
                <BasicTimePicker
                  label=""
                  name="fromTime"
                  value={selectedStartTime}
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
                  value={selectedEndDate}
                  disableFrom={selectedStartDate}
                  onHandleDateChange={handleDateChange}
                />
                <BasicTimePicker
                  name="toTime"
                  value={selectedEndTime}
                  onChange={handleTimeChange}
                  helperText={
                    errorMessages.timeError ? errorMessages.timeError : ""
                  }
                  error={errorMessages.timeError ? true : false}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ marginLeft: "40px", width: "100%" }}>
                <TextField
                  label="Appointment Title*"
                  value={appointmentSubject}
                  onChange={handleAppointmentSubject}
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
            {type === "schedule" && (
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
                    value={selectedAppointmentType}
                    options={scheduleList}
                    onChange={handleAppointmentType}
                    placeholder="Select Appointment Type*"
                    helperText={
                      errorMessages.appointmentTypeError
                        ? errorMessages.appointmentTypeError
                        : ""
                    }
                    error={errorMessages.appointmentTypeError ? true : false}
                  />
                </div>
              </div>
            )}

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
                  value={selectedDescription}
                  onChange={handleDescription}
                />
              </div>
            ) : null}
          </DialogContent>
          <DialogActions>
            <CustomButton
              color="secondary"
              onClick={() => handleDeleteEvent(eventClickInfo.event.id, type)}
            >
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
    )
  );
}

// <DialogContent dividers>
//   <div style={{ display: "flex" }}>
//     <PersonOutlineOutlinedIcon
//       style={{
//         width: 28,
//         height: 28,
//         margin: "30px 10px 0px 0px",
//         color: "#685bc7",
//       }}
//     />
//     <div style={{ width: "100%" }}>
//       <AutocompleteTextField
//         label="Consultant Name*"
//         options={props.consultantList}
//         value={agentName}
//         disableOptions={agents}
//         onChange={handleAgentName}
//         placeholder="Select consultatnt"
//         helperText={errorMessages.agentNameError}
//         error={errorMessages.agentNameError ? true : false}
//       />
//     </div>
//   </div>
//   <div style={{ display: "flex" }}>
//     <PeopleAltOutlinedIcon
//       style={{
//         width: 28,
//         height: 28,
//         margin: "30px 10px 0px 0px",
//         color: "#685bc7",
//       }}
//     />
//     <div style={{ width: "100%" }}>
//       <MultiSelector
//         customersName={customersName}
//         onChange={handleCustomerName}
//         helperText={
//           errorMessages.customerError ? errorMessages.customerError : ""
//         }
//         error={errorMessages.customerError ? true : false}
//       />
//     </div>
//   </div>
//   <div style={{ display: "flex" }}>
//     <ScheduleRoundedIcon
//       style={{
//         width: 28,
//         height: 28,
//         margin: "30px 10px 0px 0px",
//         color: "#685bc7",
//       }}
//     />
//     <div style={{ width: "100%" }}>
//       <TimeZonePicker
//         label="Time Zone*"
//         timeZoneData={momentTimeZone.tz.names()}
//         value={timeZone}
//         onChange={handleTimePicker}
//       />
//     </div>
//   </div>

//   <div style={{ display: "flex", width: "100%" }}>
//     <div>
//       <DateRangeRoundedIcon
//         style={{
//           width: 28,
//           height: 28,
//           margin: "35px 10px 0px 0px",
//           color: "#685bc7",
//         }}
//       />
//     </div>

//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         width: "100%",
//       }}
//     >
//       <BasicDatePicker
//         label="Start Date & Time*"
//         name="start Date"
//         format="MM/dd/yyyy"
//         value={startDate}
//         disableFrom={new Date()}
//         onHandleDateChange={handleDateChange}
//       />
//       <BasicTimePicker
//         label=""
//         name="fromTime"
//         value={startTime}
//         onChange={handleTimeChange}
//         helperText={errorMessages.timeError ? errorMessages.timeError : ""}
//         error={errorMessages.timeError ? true : false}
//       />
//       <div style={{ margin: "32px 0px 20px 0px" }}>-</div>
//       <BasicDatePicker
//         label="End Date & Time*"
//         name="end Date"
//         format="MM/dd/yyyy"
//         value={endDate}
//         disableFrom={startDate}
//         onHandleDateChange={handleDateChange}
//       />
//       <BasicTimePicker
//         name="toTime"
//         value={endTime}
//         onChange={handleTimeChange}
//         helperText={errorMessages.timeError ? errorMessages.timeError : ""}
//         error={errorMessages.timeError ? true : false}
//       />
//     </div>
//   </div>

//   {scheduleType ? (
//     <div style={{ display: "flex" }}>
//       <DescriptionOutlinedIcon
//         style={{
//           width: 28,
//           height: 28,
//           margin: "35px 10px 0px 0px",
//           color: "#685bc7",
//         }}
//       />

//       <div style={{ width: "100%" }}>
//         <AutocompleteTextField
//           label="Appointment Type*"
//           value={scheduleType}
//           options={props.customerList}
//           onChange={handleScheduleType}
//           placeholder="Select Appointment Type"
//           helperText={
//             errorMessages.appointmentTypeError
//               ? errorMessages.appointmentTypeError
//               : ""
//           }
//           error={errorMessages.appointmentTypeError ? true : false}
//         />
//       </div>
//     </div>
//   ) : (
//     ""
//   )}
//   <div style={{ display: "flex" }}>
//     <div style={{ marginLeft: "40px", width: "100%" }}>
//       <TextField
//         label="Appointment Title*"
//         value={appointmentSubject}
//         onChange={handleChange}
//         placeholder="Type appointment title here"
//         helperText={
//           errorMessages.appointmentSubjectError
//             ? errorMessages.appointmentSubjectError
//             : ""
//         }
//         error={errorMessages.appointmentSubjectError ? true : false}
//       />
//     </div>
//   </div>

//   <div style={{ float: "right" }}>
//     <button
//       onClick={() => setMore(!more)}
//       style={{
//         background: "none",
//         border: "none",
//         outline: "none",
//         textDecoration: "underline",
//         cursor: "pointer",
//       }}
//     >
//       {more ? "Less" : "More"}
//     </button>
//   </div>

//   {more ? (
//     <div style={{ width: "100%" }}>
//       <Editor
//         label="Description"
//         value={description}
//         onChange={handleDescription}
//       />
//     </div>
//   ) : null}
// </DialogContent>;
