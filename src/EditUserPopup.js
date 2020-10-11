import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "./TextField";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";

export default function EditUser(props) {
  const [open, setOpen] = useState(false);
  const initialFormState = { id: null, name: "hello", email: "" };
  const [user, setUser] = useState(initialFormState);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  useEffect(() => {
    setUser(props.currentUser);
  }, [props.currentUser]);

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  console.log(props);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      modal={true}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Customer</DialogTitle>
      <DialogContent dividers>
        <form
          id="my-form-id"
          onSubmit={(event) => {
            event.preventDefault();
            props.updateUser(user.id, user, open);
            setUser(initialFormState);
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              <PersonOutlineOutlinedIcon
                style={{
                  width: 28,
                  height: 28,
                  margin: "35px 10px 0px 0px",
                  color: "#685bc7",
                }}
              />

              <TextField
                label="Name*"
                name="name"
                placeholder="John Doe"
                value={user.name}
                width={400}
                onChange={handleChange}
                //onChange={(e) => handleName(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: "flex" }}>
                <MailOutlineOutlinedIcon
                  style={{
                    width: 28,
                    height: 28,
                    margin: "35px 10px 0px 0px",
                    color: "#685bc7",
                  }}
                />
                <TextField
                  label="Email*"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  value={user.email}
                  width={400}
                  onChange={handleChange}

                  //onChange={(e) => handleEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          remove
        </Button>
        <Button type="submit" form="my-form-id" color="primary">
          save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
