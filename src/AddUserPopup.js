// import React, { useEffect, useState } from "react";
// import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import TextField from "./TextField";
// import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
// import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";

// export default function FormDialog(props) {
//   const [open, setOpen] = React.useState(false);

//   const handleClose = () => {
//     setOpen(false);
//   };

//   // const [name, setName] = useState("");
//   // const [email, setEmail] = useState("");
//   const [user,setUser]=useState({id:null,name:'',email:''})

//   useEffect(() => {
//     setOpen(props.open);
//   }, [props]);

//   // const handleName = (value) => {
//   //   setName(value);
//   // };
//   // const handleEmail = (value) => {
//   //   setEmail(value);
//   // };

//   return (
//     <div>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="form-dialog-title"
//       >
//         <DialogTitle id="form-dialog-title">Add Customer</DialogTitle>
//         <DialogContent dividers>
//           <div
//             style={{
//               display: "flex",
//               flex: 1,
//               flexDirection: "column",
//             }}
//           >
//             <div style={{ display: "flex" }}>
//               <PersonOutlineOutlinedIcon
//                 style={{
//                   width: 28,
//                   height: 28,
//                   margin: "35px 10px 0px 0px",
//                   color: "#685bc7",
//                 }}
//               />

//               <TextField
//                 label="Name*"
//                 placeholder="John Doe"
//                 value={name}
//                 width={400}
//                 handleChange={(e) => handleName(e.target.value)}
//               />
//             </div>

//             <div>
//               <div style={{ display: "flex" }}>
//                 <MailOutlineOutlinedIcon
//                   style={{
//                     width: 28,
//                     height: 28,
//                     margin: "35px 10px 0px 0px",
//                     color: "#685bc7",
//                   }}
//                 />
//                 <TextField
//                   label="Email*"
//                   placeholder="johndoe@gmail.com"
//                   value={email}
//                   width={400}
//                   handleChange={(e) => handleEmail(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={() => props.handleAddUser(name, email, open)}
//             color="primary"
//           >
//             ADD
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "./TextField";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const initialFormState = { id: null, name: "", email: "" };
  const [user, setUser] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props]);
  return (
    <div>
      <Dialog
        open={open}
        modal={true}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Customer</DialogTitle>
        <DialogContent dividers>
          <form
            id="my-form-id"
            onSubmit={(event) => {
              event.preventDefault();
              props.handleAddUser(user, open);
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
                  />
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="my-form-id" color="primary">
            ADD
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
