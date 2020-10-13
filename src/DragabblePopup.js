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
import axios from "./axios";
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
  const [editable, setEditable] = React.useState(false);
  const [date, setDate] = useState(moment().format("MM-DD-YYYY"));

  const [start, startTime] = useState(moment());
  const [end, endTime] = useState(moment());
  const [appointmentSubject, setAppointmentSubject] = useState("");
  const [editableTitle, setEditableTitle] = React.useState("");
  const [agentName, setAgentName] = useState([]);
  const [appointmentType, setAppointmentType] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState([]);
  const [submitData, setSubmitData] = useState({
    consultant: {},
    customers: [],
    appointmentType: {},
    start: null,
    stop: null,
  });

  //handling more-less button
  const [more, setMore] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (name, value) => {
    setDate(value);
    console.log(name, value);
  };
  const handleChange = (e) => {
    setAppointmentSubject(e.target.value);
  };
  useEffect(() => startTime(props.selectedInfo && props.selectedInfo.start), [
    props,
  ]);
  useEffect(() => endTime(props.selectedInfo && props.selectedInfo.end), [
    props,
  ]);
  useEffect(() => setEditable(props.editable), [props]);
  useEffect(() => setEditableTitle(props.editableTitle), [props]);
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

  //jsonplaceholder.typicode.com/posts
  useEffect(() => {
    axios
      .get("/agent/")
      .then((response) => {
        console.log(response);
        setAgentName(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get("/schedule_type/")
      .then((response) => {
        console.log(response);
        setAppointmentType(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleAgentName = (value) => {
    //console.log(value);
    setSelectedAgent(value);
  };
  const handleCustomerName = (value) => {
    //console.log(value);
    setSelectedCustomers(value);
  };

  const handleAppointmentType = (value) => {
    setSelectedAppointmentType(value);
  };

  const handleSubmit = (selectedInfo) => {
    console.log({ selectedInfo });
    setSubmitData({
      consultant: selectedAgent,
      customers: selectedCustomers,
      appointmentType: selectedAppointmentType,
      start: start,
      stop: end,
    });
    let calendarApi = selectedInfo.view.calendar;
    // calendarApi.unselect(); // clear date selection
    // let title = appointmentSubject;
    if (appointmentType) {
      calendarApi.addEvent({
        id: 101,
        title: selectedAppointmentType.name,
        start: start,
        color: "#3788d8", // override!,
        borderColor: "#3788d8",
        end: end,
      });
    }

    // let formData = {
    //   date: date,
    //   start: start,
    //   end: end,
    //   appointmentSubject: appointmentSubject,
    // };
    // console.log({ formData });
    handleClose();
  };

  const handleTimeChange = (name, value) => {
    // const { name, value } = e.target;
    name === "fromTime" ? startTime(value) : endTime(value);
    console.log(name, value);
  };
  //console.log(props.selectedInfo);
  console.log({ submitData });

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
          {editableTitle ? editableTitle : "Add Appointment"}
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
                options={agentName}
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
              <MultiSelector onChange={handleCustomerName} />
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
              />

              <TimePicker
                label="To Time*"
                name="toTime"
                value={end}
                onChange={handleTimeChange}
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
                options={appointmentType}
                onChange={handleAppointmentType}
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
              <TextField label="Description" multiline={true} rows={4} />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          {editable ? (
            <Button onClick={handleClose} color="secondary">
              Remove
            </Button>
          ) : null}
          <Button
            style={{ marginRight: 15 }}
            onClick={() => handleSubmit(props.selectedInfo)}
            color="primary"
            variant="outlined"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
