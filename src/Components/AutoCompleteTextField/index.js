/* eslint-disable no-use-before-define */
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

function ComboBox(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>
      <div style={{ marginBottom: 10 }}>
        <Autocomplete
          PopperComponent={PopperMy}
          value={props.value}
          onChange={props.onChange}
          options={props.options}
          disableClearable
          getOptionDisabled={
            props.disableOptions && props.disableOptions.length > 0
              ? (option) =>
                  !!props.disableOptions.find((e) => e.id === option.id)
              : false
          }
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              // name={props.name}
              helperText={props.helperText}
              error={props.error}
              placeholder={props.placeholder}
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
