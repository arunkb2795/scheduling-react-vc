import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

function CustomSelect(props) {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <div>
      <InputLabel style={{ margin: "5px 0px 5px 0px", fontSize: 14 }}>
        Appointment Type
      </InputLabel>

      <Select
        style={{
          //margin: 10,
          marginTop: 5,
          height: 42,
          fontSize: 14,
        }}
        value={age}
        onChange={handleChange}
        displayEmpty
        variant="outlined"
        fullWidth
      >
        <MenuItem style={{ fontSize: 14 }} value="" disabled>
          Select Type
        </MenuItem>
        <MenuItem style={{ fontSize: 14 }} value={10}>
          Product introduction
        </MenuItem>
        <MenuItem style={{ fontSize: 14 }} value={20}>
          First time meet
        </MenuItem>
        <MenuItem style={{ fontSize: 14 }} value={30}>
          Enquiry meet
        </MenuItem>
      </Select>
    </div>
  );
}

export default CustomSelect;
