/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";

function ComboBox(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>

      <div style={{ width: 515, marginBottom: 10 }}>
        <Autocomplete
          PopperComponent="bottom"
          onChange={(e, value) => props.onChange(value)}
          options={props.options}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              placeholder={props.placeholder}
              //label="Combo box"
              variant="outlined"
              size="small"
            />
          )}
        />
      </div>
    </div>
  );
}

export default ComboBox;
