import React from "react";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";

function BasicTimePicker(props) {
  return (
    <div style={{ paddingTop: "19px" }}>
      <InputLabel style={{ margin: "5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <TimePicker
          name={props.name}
          //margin="normal"
          inputVariant="outlined"
          style={{ width: 110, marginBottom: 10 }}
          size="small"
          disabled={props.disabled}
          value={props.value}
          helperText={props.helperText}
          error={props.error}
          onChange={(value) => props.onChange(props.name, value)}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default BasicTimePicker;
