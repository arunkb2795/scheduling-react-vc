import React from "react";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";

function CustomTextField(props) {
  return (
    <div>
      <InputLabel style={{ margin: "10px 0px 5px 10px", fontSize: 14 }}>
        {props.label}
      </InputLabel>

      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          style={{
            margin: 10,
            marginTop: 5,
            marginRight: 0,
            width: props.width,
          }}
          type="text"
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
        />
      </div>
    </div>
  );
}

export default CustomTextField;
