import React from "react";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";

function BasicDatePicker(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          inputVariant="outlined"
          //margin="normal"
          size="small"
          error={false}
          helperText={false}
          name={props.name}
          disabled={props.disabled}
          style={{ width: 140, marginBottom: 10 }}
          format={"MM/dd/yyyy"}
          value={props.value}
          minDate={props.disableFrom}
          onChange={(value) => props.onHandleDateChange(props.name, value)}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default BasicDatePicker;
