import React from "react";
import { getStockStatus } from "../../utils/stock.js";

const StatusBadge = ({ ingredient, styles }) => {
  const status = getStockStatus(ingredient);

  const statusClass =
    status === "Crítico"
      ? styles.statusCritical
      : status === "Bajo"
      ? styles.statusLow
      : status === "OK"
      ? styles.statusOk
      : "";

  return (
    <span className={`${styles.statusBadge} ${statusClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
