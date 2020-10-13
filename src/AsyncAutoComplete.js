// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "./axios";
import Chip from "@material-ui/core/Chip";
import TextFieldCustom from "./TextField";
import Button from "@material-ui/core/Button";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { useFormik } from "formik";
import * as Yup from "yup";
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email formal").required("Required"),
});
const initialValues = { name: "", email: "" };
const onSubmit = (values) => {
  console.log("Form data", values);
};
export default function Asynchronous() {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected, getSelected] = React.useState([]);
  const [createdValue, setCreatedValue] = React.useState({
    id: null,
    name: "",
    email: "",
  });
  const [oldValue, setOldValue] = React.useState([]);

  const initialFormState = { id: null, name: "", email: "" };
  const [user, setUser] = useState(initialFormState);

  //console.log("Form Values : ", formik.values);
  function handleClickOpen() {
    setUser(initialFormState);
    setOpen(!open);
  }

  function handleClose() {
    setUser(initialFormState);
    setOpen(false);
  }

  function editClose() {
    setUser(initialFormState);
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

  // const onSubmit = (values) => {
  //   console.log("parent", values);
  // };

  return (
    <div>
      <Autocomplete
        value={selected}
        multiple
        //limitTags={2}
        size="small"
        id="tags-filled"
        //PopperComponent="bottom"
        onOpen={handleOpen}
        options={options}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.name === value.name}
        onChange={selectedValue}
        style={{ width: 500, padding: 10 }}
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
          />
        )}
      />

      <Fab
        color="primary"
        aria-label="Add"
        size="small"
        onClick={handleClickOpen}
      >
        <AddIcon fontSize="small" />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <form
            id="my-form-id"
            onSubmit={formik.handleSubmit}
            // onSubmit={(event) => {
            //   event.preventDefault();
            //   let userData = {
            //     name: user.name,
            //     email: user.email,
            //   };
            //   console.log(userData);
            //   axios
            //     .post("/customer/", userData)
            //     .then((response) => addUser(response.data));
            //   setUser(initialFormState);
            //   handleClose();
            // }}
          >
            <TextFieldCustom
              label="Name*"
              name="name"
              placeholder="John Doe"
              helperText={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : null
              }
              value={formik.values.name}
              width={500}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextFieldCustom
              label="Email*"
              name="email"
              helperText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : null
              }
              placeholder="johndoe@gmail.com"
              value={formik.values.email}
              width={500}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <Button
              variant="outlined"
              type="submit"
              form="my-form-id"
              color="primary"
            >
              ADD
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* edit user popup */}

      {/* <Dialog
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
            <Button onClick={() => handleDelete(user)}>Remove</Button>
            <Button
              variant="outlined"
              type="submit"
              form="my-form-id2"
              color="primary"
            >
              Save CHanges
            </Button>
          </form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
