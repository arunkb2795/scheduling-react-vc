import React from "react";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";

function CustomTextField(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        {props.label}
      </InputLabel>

      <div>
        <TextField
          style={{ width: "100%" }}
          type="text"
          helperText={props.helperText}
          error={props.error}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          variant="outlined"
          size="small"
          multiline={props.multiline}
          rows={props.rows}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
      </div>
    </div>
  );
}

export default CustomTextField;
