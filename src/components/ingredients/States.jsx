import React from "react";
import Button from "../common/Button";
import { RefreshCw, Plus } from "lucide-react";

export const LoadingSkeleton = ({ styles }) => (
  <div className={styles.skeletonContainer}>
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className={styles.skeletonRow}>
        {Array.from({ length: 7 }).map((__, i) => (
          <div key={i} className={styles.skeletonCell}></div>
        ))}
      </div>
    ))}
  </div>
);

export const ErrorState = ({ styles, onRetry }) => (
  <div className={styles.errorState}>
    <div className={styles.errorIcon}>⚠️</div>
    <h3 className={styles.errorTitle}>Error al cargar ingredientes</h3>
    <p className={styles.errorDescription}>
      Hubo un problema al obtener la lista de ingredientes. Inténtalo de nuevo.
    </p>
    <Button variant="primary" onClick={onRetry}>
      <RefreshCw size={16} />
      Reintentar
    </Button>
  </div>
);

export const EmptyState = ({ styles, showCreate, onCreate }) => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>📦</div>
    <h3 className={styles.emptyTitle}>No se encontraron ingredientes</h3>
    <p className={styles.emptyDescription}>
      {showCreate
        ? "Comienza agregando tu primer ingrediente al inventario."
        : "Intenta ajustar los filtros de búsqueda."}
    </p>
    {showCreate && (
      <Button variant="primary" onClick={onCreate}>
        <Plus size={16} />
        Agregar ingrediente
      </Button>
    )}
  </div>
);
