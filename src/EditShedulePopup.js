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
  const [sheduleInfo, setSheduleInfo] = useState({});
  const [selectedAppointmentType, setSelectedAppointmentType] = useState([]);

  const [agentName, setAgentName] = useState({});
  const [startTime, setStartTime] = useState("");
  const [appointmentType, setAppointmentType] = useState([]);
  const [eventClickDetails, setEventClickDetails] = useState({});

  useEffect(() => {
    setEventClickDetails(props.eventClickInformation);
  }, [props]);

  useEffect(() => {
    setAgentName(props.consultantList[0]);
    setAppointmentType(props.customerList[1]);
    setStartTime("2020-10-08T17:41:03Z");
  }, []);

  //handling more-less button
  const [more, setMore] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleStartTimeChange = (name, value) => {
    console.log(value);
    setStartTime(moment(value).format());
  };
  const handleAppointmentType = (value) => {
    setAppointmentType(value);
    //setvalidator({ typevalidator: "", error: false });
  };

  const handleAgentName = (value) => {
    console.log("agetName", value);
    setAgentName(value);
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleSubmit = () => {
    console.log("agenName", agentName, "appointmentType", appointmentType);
  };

  const handleDelete = () => {
    props.handleDeleteEvent(eventClickDetails.id, open);
  };

  console.log({ eventClickDetails });
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
                //defaultValue={props.agentName[0]}
                value={agentName}
                handleChange={handleAgentName}
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
              <MultiSelector //onChange={handleCustomerName}
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
                value="2020-02-02T09:30"
                //onHandleDateChange={handleDateChange}
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
                value="2020-02-02T09:30"
                //onChange={handleTimeChange}
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
                value={appointmentType}
                options={props.customerList}
                handleChange={handleAppointmentType}
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
                //value={appointmentSubject}
                //onChange={handleChange}
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
          <Button onClick={handleDelete} color="secondary">
            Remove
          </Button>
          <Button
            style={{ marginRight: 15 }}
            onClick={handleSubmit}
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
