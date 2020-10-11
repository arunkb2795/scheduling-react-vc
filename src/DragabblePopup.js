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
import Select from "./Select";
import AutocompleteTextField from "./AutoComplete";
import IconButton from "@material-ui/core/IconButton";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";

import AddUserPopup from "./AddUserPopup";
import EditUserPopup from "./EditUserPopup";

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
  const [customerName, setCustomerName] = useState([]);

  //handling more-less button
  const [more, setMore] = useState(false);
  //handle addUserpopup
  const [addUserPopup, setAddUserPopup] = useState(false);
  //handle editUserPopup
  const [editUserPopup, setEditUserPopup] = useState(false);
  const [editUserData, setEditUserData] = useState({});

  const handleClose = () => {
    setOpen(false);
    setAddUserPopup(false);
    setEditUserPopup(false);
  };

  const handleStartChange = (e) => {
    startTime(e.target.value);
  };

  const handleEndChange = (value) => {
    endTime(value);
  };
  const handleDateChange = (value) => {
    setDate(value);
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

  //add user function

  const addUser = (user, open) => {
    let userData = {
      name: user.name,
      email: user.email,
    };
    console.log(userData);
    axios
      .post("/customer/", userData)
      .then((response) => console.log(response));
    setAddUserPopup(!open);
  };

  const handleChipClik = (id) => {
    setEditUserPopup(true);
    axios
      .get(`/customer/${id}`)
      .then((response) => {
        setEditUserData(response.data);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };
  const handleSelectedValue = (value) => {
    // let data = {
    //   name: value[0].name,
    //   email: value[0].email,
    // };
    // console.log({ value });
    // setEditUser(data);
  };

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

  const handleApicall = () => {
    setAddUserPopup(false);
    setEditUserPopup(false);
    axios

      .get("/customer/")
      .then((response) => {
        console.log(response);
        setCustomerName(response.data);
      })
      .catch((error) => console.log(error));
  };

  const updateUser = (user, open) => {
    let userData = {
      name: user.name,
      email: user.email,
    };
    console.log({ userData }, open);
    axios
      .put(`/customer/${user.id}`, userData)
      .then((response) => console.log(response));
    setEditUserPopup(!open);
  };

  const handleSubmit = (selectedInfo) => {
    console.log({ selectedInfo });
    let calendarApi = selectedInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    let title = appointmentSubject;
    if (title) {
      calendarApi.addEvent({
        id: 101,
        title,
        start: start,
        color: "#3788d8", // override!,
        borderColor: "#3788d8",
        end: end,
      });
    }

    let formData = {
      date: date,
      start: start,
      end: end,
      appointmentSubject: appointmentSubject,
    };
    console.log({ formData });
    handleClose();
  };
  //console.log(props.selectedInfo);

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
              />
              {/* <CreatablSelect label="Consultant Name*" options={agentName} /> */}
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
              // options={customerName}
              // onChipClik={handleChipClik}
              // selectedValue={handleSelectedValue}
              // apiCall={handleApicall}
              />
            </div>
            {/* <div>
              <IconButton
                onClick={() => setAddUserPopup(!addUserPopup)}
                style={{
                  marginTop: "24px",
                  marginLeft: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  padding: " 6px",
                }}
              >
                <PersonAddOutlinedIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: "#685bc7",
                  }}
                />
              </IconButton>
            </div> */}
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
                format="MM/dd/yyyy"
                value={date}
                onHandleDateChange={(value) => handleDateChange(value)}
              />

              <TimePicker
                label="From Time*"
                value={start}
                onHandleTimeChange={(e) => handleStartChange(e.target.value)}
              />

              <TimePicker
                label="To Time*"
                value={end}
                onHandleTimeChange={(e) => handleEndChange(e.target.value)}
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
              <Select />
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
        {addUserPopup ? (
          <AddUserPopup open={addUserPopup} handleAddUser={addUser} />
        ) : null}
        {editUserPopup ? (
          <EditUserPopup
            open={editUserPopup}
            currentUser={editUserData}
            updateUser={updateUser}
          />
        ) : null}
      </Dialog>
    </div>
  );
}
