import React, { useState } from "react";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { eventDetailsAction } from "../../Redux/eventDetails-slice";
import { getCalenderEvents } from "../../Redux/eventDetails-slice";
export default function MultiSelect(props) {
  const { options } = props;
  const [selectedOption, setSelectedOption] = useState(null);
  const { searchText, start, end } = useSelector(
    (state) => state.eventDetailsReducer
  );

  const dispatch = useDispatch();
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      zIndex: 2,
    }),
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "#F0EFF9",
        borderColor: "#685BC7",
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#685BC7",
      borderColor: "#685BC7",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#685BC7",
      ":hover": {
        backgroundColor: "#F0EFF9",
        color: "#685BC7",
      },
    }),
  };

  const handleChange = (value) => {
    setSelectedOption(value);
    let result = value.map((item) => {
      return item.value;
    });
    dispatch(eventDetailsAction.setSelectedAgent(result.toString()));
    dispatch(getCalenderEvents(result.toString(), searchText, start, end));
  };

  return (
    <Select
      isMulti
      name="colors"
      options={[{ label: "Select All", value: "all" }, ...options]}
      styles={customStyles}
      value={selectedOption}
      onChange={(selected) => {
        if (
          selected !== null &&
          selected.length > 0 &&
          selected[selected.length - 1].value === "all"
        ) {
          return handleChange(options);
        }
        return handleChange(selected);
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
          ...theme.colors,
          primary25: "#F0EFF9",
          primary: "#685BC7",
        },
      })}
    />
  );
}
