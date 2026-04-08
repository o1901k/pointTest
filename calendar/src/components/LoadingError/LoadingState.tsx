import React from "react";
import styles from "./States.module.css";

const LoadingState: React.FC = () => (
  <div className={`${styles.container} ${styles.loading}`}>
    <div className={styles.spinner} />
    <div className={styles.loadingText}>Загрузка соревнований...</div>
  </div>
);

export default LoadingState;
