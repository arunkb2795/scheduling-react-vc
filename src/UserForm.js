import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogActions } from "@material-ui/core";
import TextFieldCustom from "./TextField";
import Button from "@material-ui/core/Button";

export default function UserForm(props) {
  const [userFormOpen, setUserFormOpen] = useState(props.userFormOpen);

  const userFormClose = () => {
    setUserFormOpen(!userFormOpen);
  };

  return (
    <Dialog
      open={userFormOpen}
      onClose={userFormClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
      <DialogContent>
        <form
        //   id="my-form-id2"
        //   onSubmit={(event) => {
        //     event.preventDefault();
        //     let userData = {
        //       name: user.name,
        //       email: user.email,
        //     };
        //     console.log(userData);
        //     axios
        //       .put(`/customer/${user.id}`, userData)
        //       .then((response) => updateUser(response.data));
        //     setUser(initialFormState);
        //     editClose();
        //   }}
        >
          <TextFieldCustom
            label="Name*"
            name="name"
            placeholder="John Doe"
            //value={user.name}
            width={500}
            //onChange={handleChange}
          />
          <TextFieldCustom
            label="Email*"
            name="email"
            placeholder="johndoe@gmail.com"
            //value={user.email}
            width={500}
            //onChange={handleChange}
          />
          <DialogActions>
            {/* <Button color="secondary" onClick={() => handleDelete(user)}>
              Remove
            </Button> */}
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
  );
}
