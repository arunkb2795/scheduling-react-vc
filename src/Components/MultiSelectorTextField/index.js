import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "../../api/axios";
import Chip from "@material-ui/core/Chip";
import TextFieldCustom from "../TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import { DialogActions } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import TimeZonePicker from "../TimeZonePicker";
import TimezoneList from "../../Utils/TimezoneList";



//import UserForm from './UserForm'

const PopperMy = function (props) {
  return (
    <div>
      <Popper {...props} placement="top-start" />
    </div>
  );
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} style={{ width: 600 }} />
    </Draggable>
  );
}

export default function Tags(props) {
  const initialFormState = { id: null, name: "", email: ""};
  const [dropdownOpen, setDropDownOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected, getSelected] = React.useState(
    props.customersName ? props.customersName : []
  );
  const [createdValue, setCreatedValue] = React.useState({});
  const [user, setUser] = useState(initialFormState);
  const [finalData, setFinalData] = useState({});
  const loading = dropdownOpen && options.length === 0;
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [timeZone, setTimeZone] = useState(TimezoneList()[33]);

  useEffect(() => {
    var active = true;

    if (!loading) {
      return undefined;
    }

    axios
      .get("/customer/")
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => console.log(error));

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!dropdownOpen) {
      setOptions([]);
    }
  }, [dropdownOpen]);

  function handleClickOpen() {
    setOpen(!open);
    setTimeZone(TimezoneList()[33])
  }

  function handleClose() {
    setOpen(false);
    setUser(initialFormState);
    setNameError("");
    setEmailError("");
  }

  function editClose() {
    setEditOpen(false);
    setCreatedValue(initialFormState);
    setUser(initialFormState);
    setNameError("");
    setEmailError("");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setNameError("");
    }
    if (name === "email") {
      setEmailError("");
    }
    setUser({ ...user, [name]: value });
  };

  const handleTimezoneChange = (e, value) => {
    console.log(value)
    setTimeZone(value)
    // setUser({...user,['time_zone']:value.value})
  }

  useEffect(() => {
    createdValue.name
      ? getSelected([...selected, createdValue])
      : getSelected(selected);
  }, [createdValue]);

  const selectedValue = (e, value) => {
    getSelected(value);
  };

  useEffect(() => {
    setFinalData(selected);
  }, [selected]);

  useEffect(() => {
    console.log("final data : ", { selected });
    props.onChange(finalData);
  }, [finalData]);

  const addUser = (data) => {
    setCreatedValue(data);
    setUser(initialFormState);
  };

  const updateUser = (data) => {
    const result = selected.filter((item) => item.id !== data.id);
    let newArray = [...result, data];
    //getSelected(afterFilter);
    getSelected(newArray);
    setUser(initialFormState);
  };

  const onChipClik = (option) => {
    setEditOpen(true);
    setUser(option);
  };

  const handleDelete = (data) => {
    axios
      .delete(`/customer/${data.id}`)
      .then((response) => {
        console.log(response);
        //setOptions(response.data);
      })
      .catch((error) => console.log(error));
    const result = selected.filter((item) => item.id !== data.id);
    let newArray = result;
    getSelected(newArray);
    setEditOpen(false);
    setUser(initialFormState);
  };

  const validateFunction = (user) => {
    let valid = true;
    if (!user.name) {
      valid = false;
      setNameError("Required");
    }
    if (!user.email) {
      valid = false;
      setEmailError("Required");
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        user.email
      )
    ) {
      valid = false;
      setEmailError("Invalid Email");
    }
    return valid;
  };

  console.log(user)

  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        Customer Name*
      </InputLabel>
      <div style={{ marginBottom: 10, display: "flex" }}>
        <div style={{ flex: "2" }}>
          <Autocomplete
            value={selected}
            multiple
            limitTags={2}
            onOpen={() => {
              setDropDownOpen(true);
            }}
            onClose={() => {
              setDropDownOpen(false);
            }}
            loading={loading}
            size="small"
            id="tags-filled"
            PopperComponent={PopperMy}
            options={options}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            onChange={selectedValue}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  variant="outlined"
                  onClick={() => onChipClik(option)}
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select customers"
                size="small"
                helperText={props.helperText}
                error={props.error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
        <div>
          <IconButton
            onClick={handleClickOpen}
            style={{
              //marginTop: "24px",
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
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          PaperComponent={PaperComponent}
        >
          <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
          <DialogContent dividers>
            <form
              id="my-form-id"
              onSubmit={(event) => {
                event.preventDefault();
                let userData = {
                  name: user.name,
                  email: user.email,
                  time_zone: timeZone.value,
                };
                if (validateFunction(user)) {
                  addUser(userData);
                  setUser(initialFormState);
                  handleClose();
                }
              }}
            >
              <TextFieldCustom
                label="Name*"
                name="name"
                placeholder="John Doe"
                value={user.name}
                onChange={handleChange}
                helperText={nameError}
                error={nameError ? true : false}
              />
              <TextFieldCustom
                label="Email*"
                name="email"
                placeholder="johndoe@gmail.com"
                value={user.email}
                onChange={handleChange}
                helperText={emailError}
                error={emailError ? true : false}
              />
              <div style={{ width: "100%" }}>
                <TimeZonePicker
                  label="Time Zone*"
                  options={TimezoneList()}
                  value={timeZone}
                  onChange={handleTimezoneChange}
                  disabled={false}
                />
              </div>
              {/* <Divider component="Button" /> */}
              <DialogActions style={{ padding: 0, margin: "12px 0px" }}>
                <Button
                  //variant="outlined"
                  color="primary"
                  onClick={handleClose}
                >
                  close
                </Button>
                <Button
                  variant="outlined"
                  type="submit"
                  form="my-form-id"
                  color="primary"
                >
                  ADD User
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editOpen}
          onClose={editClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
          <DialogContent>
            <form
              id="my-form-id2"
              onSubmit={(event) => {
                event.preventDefault();
                let userData = {
                  name: user.name,
                  email: user.email,
                };
                if (validateFunction(user)) {
                  axios
                    .put(`/customer/${user.id}`, userData)
                    .then((response) => updateUser(response.data));
                  setUser(initialFormState);
                  editClose();
                }
              }}
            >
              <TextFieldCustom
                label="Name*"
                name="name"
                placeholder="John Doe"
                value={user.name}
                onChange={handleChange}
                onChange={handleChange}
                helperText={nameError}
                error={nameError ? true : false}
              />
              <TextFieldCustom
                label="Email*"
                name="email"
                placeholder="johndoe@gmail.com"
                value={user.email}
                onChange={handleChange}
                helperText={emailError}
                error={emailError ? true : false}
              />
              <DialogActions style={{ padding: 0, margin: "12px 0px" }}>
                <Button color="secondary" onClick={() => handleDelete(user)}>
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  type="submit"
                  form="my-form-id2"
                  color="primary"
                >
                  Save CHanges
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
