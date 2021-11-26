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
  // const [appointmentSubject, setAppointmentSubject] = useState("");
  // const [description, setDescription] = useState("");
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

  const {
    agent,
    customers,
    moderator,
    timeZone,
    date,
    startTime,
    endTime,
    title,
    description,
    schedule_type,
    appointmentLoading,
  } = useSelector((state) => state.appointmentReducer);

  const { consultantList, customerList, open, handleClose } = props;

  console.log(agent, appointmentLoading, customers);

  // useEffect(() => {
  //   const { agent, title, description, start, stop, schedule_type, customers } =
  //     props.eventClickInformation;
  //   let startTime = start && start.substring(0, 19);
  //   let endTime = stop && stop.substring(0, 19);
  //   setEventClickDetails(props.eventClickInformation);
  //   setAppointmentSubject(title);
  //   setDescription(description);
  //   setStartTime(startTime);
  //   setEndTime(endTime);
  //   setStartDate(start);
  //   setEndDate(stop);
  //   setAgentName(agent[0]);
  //   setScheduleType(schedule_type ? schedule_type[0] : "");
  //   setCustomersName(customers);
  //   setTimeZone(agent[0].time_zone);
  // }, [open]);

  const handleCustomerName = (data) => {
    console.log(data);
  };

  return (
    !appointmentLoading && (
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
                  options={consultantList}
                  value={agent[0]}
                  // disableOptions={agents}
                  // onChange={handleAgentName}
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
                  options={consultantList}
                  value={moderator.length ? moderator[0] : []}
                  // disableOptions={agents}
                  // onChange={handleAgentName}
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
                  timeZoneData={momentTimeZone.tz.names()}
                  value={timeZone}
                  // onChange={handleTimePicker}
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
                  value={date}
                  disableFrom={new Date()}
                  // onHandleDateChange={handleDateChange}
                />
                <BasicTimePicker
                  label=""
                  name="fromTime"
                  value={startTime}
                  // onChange={handleTimeChange}
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
                  value={date}
                  disableFrom={date}
                  // onHandleDateChange={handleDateChange}
                />
                <BasicTimePicker
                  name="toTime"
                  value={endTime}
                  // onChange={handleTimeChange}
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
                  value={title}
                  // onChange={handleChange}
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
          </DialogContent>
          <DialogActions>
            <CustomButton color="secondary">Remove</CustomButton>
            <div style={{ paddingRight: 30 }}>
              <CustomButton color="primary" variant="outlined">
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
