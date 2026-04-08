import React from "react";
import styles from "./States.module.css";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className={`${styles.container} ${styles.error}`}>
    <div className={styles.errorIcon}>⚠️</div>
    <div className={styles.errorMessage}>{message}</div>
    <button className={styles.retryButton} onClick={onRetry}>
      Повторить попытку
    </button>
  </div>
);

export default ErrorState;
