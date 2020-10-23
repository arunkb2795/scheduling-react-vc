/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
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
          PopperComponent={"bottom"}
          value={props.value}
          //defaultValue={props.defaultValue}
          //onChange={(e, value) => props.onChange(value)}
          onChange={props.onChange}
          options={props.options}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              name={props.name}
              //value={props.value}
              // onChange={props.handleChange}
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
