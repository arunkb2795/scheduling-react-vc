import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "./axios";
import Chip from "@material-ui/core/Chip";
import TextFieldCustom from "./TextField";
import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import { DialogActions } from "@material-ui/core";

import Divider from "@material-ui/core/Divider";

export default function Tags(props) {
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected, getSelected] = React.useState([]);
  const [createdValue, setCreatedValue] = React.useState({
    name: "",
    email: "",
  });
  const [oldValue, setOldValue] = React.useState([]);

  const initialFormState = { id: null, name: "", email: "" };
  const [user, setUser] = useState(initialFormState);

  function handleClickOpen() {
    setOpen(!open);
  }

  function handleClose() {
    setOpen(false);
  }

  function editClose() {
    setEditOpen(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  const handleOpen = () => {
    axios
      .get("/customer/")
      .then((response) => {
        console.log(response);
        setOptions(response.data);
      })
      .catch((error) => console.log(error));
  };

  const selectedValue = (e, value) => {
    console.log("selected value :", value);
    setOldValue(value);
    getSelected(value);
    setCreatedValue({ name: "", email: "" });
  };

  useEffect(() => {
    createdValue.name
      ? getSelected([...oldValue, createdValue])
      : getSelected(oldValue);
    console.log(createdValue);
  }, [createdValue]);

  const addUser = (data) => {
    setCreatedValue(data);
    setUser(initialFormState);
  };

  const updateUser = (data) => {
    console.log("updated data : ", data);
    console.log("selected data : ", selected);
    const result = selected.filter((item) => item.id !== data.id);
    let newArray = [...result, data];
    console.log({ newArray });
    //getSelected(afterFilter);
    getSelected(newArray);
    setUser(initialFormState);
  };

  const onChipClik = (option) => {
    console.log({ option });
    setEditOpen(true);
    setUser(option);
  };

  const handleDelete = (data) => {
    console.log(data.id);
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

  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        Customer Name*
      </InputLabel>
      <div style={{ width: 450, marginBottom: 10, display: "flex" }}>
        <div>
          <Autocomplete
            value={selected}
            multiple
            //limitTags={2}
            size="small"
            id="tags-filled"
            PopperComponent="bottom"
            onOpen={handleOpen}
            options={options}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            onChange={selectedValue}
            style={{ width: 468 }}
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
                fullWidth
                {...params}
                variant="outlined"
                placeholder="Select Consultatnt"
                size="small"
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
                };
                console.log(userData);
                axios
                  .post("/customer/", userData)
                  .then((response) => addUser(response.data));
                setUser(initialFormState);
                handleClose();
              }}
            >
              <TextFieldCustom
                label="Name*"
                name="name"
                placeholder="John Doe"
                value={user.name}
                width={500}
                onChange={handleChange}
              />
              <TextFieldCustom
                label="Email*"
                name="email"
                placeholder="johndoe@gmail.com"
                value={user.email}
                width={500}
                onChange={handleChange}
              />
              {/* <Divider component="Button" /> */}
              <DialogActions>
                <Button
                  //variant="outlined"
                  color="secondary"
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

        {/* edit user popup */}

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
                console.log(userData);
                axios
                  .put(`/customer/${user.id}`, userData)
                  .then((response) => updateUser(response.data));
                setUser(initialFormState);
                editClose();
              }}
            >
              <TextFieldCustom
                label="Name*"
                name="name"
                placeholder="John Doe"
                value={user.name}
                width={500}
                onChange={handleChange}
              />
              <TextFieldCustom
                label="Email*"
                name="email"
                placeholder="johndoe@gmail.com"
                value={user.email}
                width={500}
                onChange={handleChange}
              />
              <DialogActions>
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
