import React from "react";

const Pagination = ({ styles, page, totalPages, onPrev, onNext }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className={styles.pagination} role="navigation" aria-label="Paginación de ingredientes">
      <button
        type="button"
        className={styles.paginationButton}
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      <div className={styles.paginationInfo} aria-live="polite">
        Página {page} de {totalPages}
      </div>

      <button
        type="button"
        className={styles.paginationButton}
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
