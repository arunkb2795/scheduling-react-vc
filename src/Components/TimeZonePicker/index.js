import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
//import TimeZoneData from "./TimeZoneData.json";
import Popper from "@material-ui/core/Popper";

const PopperMy = function (props) {
  return (
    <div>
      <Popper {...props} style={{ width: 515 }} placement="top-start" />
    </div>
  );
};

function TimeZonePicker(props) {
  console.log(props.timeZoneData);
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>

      <div style={{ width: 515, marginBottom: 10 }}>
        <Autocomplete
          PopperComponent={PopperMy}
          options={props.timeZoneData}
          value={props.value}
          disableClearable
          //defaultValue={TimeZoneData[2]}
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
