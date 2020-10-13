import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import ScheduleRoundedIcon from "@material-ui/icons/ScheduleRounded";
import InputLabel from "@material-ui/core/InputLabel";

function KeyboardTimePickerExample(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 0px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          name={props.name}
          margin="normal"
          inputVariant="outlined"
          style={{ width: 142, marginTop: 10 }}
          size="small"
          value={props.value}
          onChange={(value) => props.onChange(props.name, value)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          keyboardIcon={<ScheduleRoundedIcon size="small" />}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default KeyboardTimePickerExample;
