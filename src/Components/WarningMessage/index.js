import React from "react";
import Alert from "../../assets/Alert";
import styles from "./styles.module.scss";

export default function WarningMessage() {
  return (
    <div className={styles.warningContainer}>
      <Alert />
      <span className={styles.message}>
        The time conflicts with another appointment or is outside of your
        availability hours.
      </span>
    </div>
  );
}
