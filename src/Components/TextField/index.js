import React from "react";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";

function CustomTextField(props) {
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 0px 10px", fontSize: 14 }}>
        {props.label}
      </InputLabel>

      <div style={{ display: "flex", alignItems: "center", width: "525px" }}>
        <TextField
          style={{
            margin: 10,
            marginTop: 5,
            marginRight: 0,
            width: props.width,
          }}
          type="text"
          helperText={props.helperText}
          error={props.error}
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          variant="outlined"
          size="small"
          fullWidth
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
