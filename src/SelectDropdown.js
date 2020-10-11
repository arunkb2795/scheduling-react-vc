import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";

import InputLabel from "@material-ui/core/InputLabel";

// We can inject some CSS into the DOM.
const styles = {
  root: {
    fontSize: 14,
  },
};

function CustomTextDropDown(props) {
  const { classes, children, className, ...other } = props;

  return (
    <div>
      {/* <TextField
        label="Name"
        className={clsx(classes.root, className)}
        {...other}
      >
        {children || "class names"}
      </TextField> */}
      <InputLabel style={{ marginLeft: 38, fontSize: 14 }}>
        Appointment Subject
      </InputLabel>

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <div>
          <PersonOutlineOutlinedIcon
            style={{ width: 28, height: 28, color: "#685bc7" }}
          />
        </div> */}

        <div>
          <Select
            //value={age}
            //onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              Placeholder
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </div>
      </div>
      {/* <TextField
        id="standard-full-width"
        label="Full Name with sataus"
        style={{ margin: 8 }}
        placeholder="Placeholder"
        helperText="Full width!"
        fullWidth
        variant="outlined"
        InputProps={{
          classes: {
            input: classes.root,
          },
        }}
        InputLabelProps={{
          //shrink: true,
          classes: {
            root: classes.labelRoot,
          },
        }}
      />
      <TextField
        id="standard-full-width"
        label="Full Name with sataus"
        style={{ margin: 8 }}
        placeholder="Placeholder"
        helperText="Full width!"
        fullWidth
        variant="outlined"
        InputProps={{
          classes: {
            input: classes.root,
          },
        }}
        InputLabelProps={{
          shrink: true,
          classes: {
            root: classes.labelRoot,
          },
        }}
      /> */}
    </div>
  );
}

export default withStyles(styles)(CustomTextDropDown);
