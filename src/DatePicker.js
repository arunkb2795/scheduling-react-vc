import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";

export default function DatePicker(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 0px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          inputVariant="outlined"
          margin="normal"
          size="small"
          name={props.date}
          style={{ width: 158, marginTop: 10 }}
          format={"MM/dd/yyyy"}
          value={props.value}
          onChange={(value) => props.onHandleDateChange(props.name, value)}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
