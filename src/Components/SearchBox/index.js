import React from "react";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import IconButton from "@material-ui/core/IconButton";
import styles from "./styles.module.scss";
export default function index(props) {
  const { handleChange, handleSearchClick, handleKeydown } = props;
  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.box}
        type="text"
        placeholder="Search.."
        name="search"
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />
      <div className={styles.search}>
        <IconButton color="primary" onClick={handleSearchClick}>
          <SearchRoundedIcon />
        </IconButton>
      </div>
    </div>
  );
}
