import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import Popper from "@material-ui/core/Popper";

const PopperMy = function (props) {
  return (
    <div>
      <Popper {...props} placement="top-start" />
    </div>
  );
};

function TimeZonePicker(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>

      <div style={{ marginBottom: 10 }}>
        <Autocomplete
          PopperComponent={PopperMy}
          options={props.timeZoneData}
          value={props.value}
          disableClearable
          getOptionLabel={(option) => option}
          size="small"
          onChange={props.onChange}
          renderInput={(params) => (
            <TextField {...params} size="small" variant="outlined" />
          )}
        />
      </div>
    </div>
  );
}

export default TimeZonePicker;
