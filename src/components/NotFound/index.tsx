import React from 'react';
import styles from './index.module.css';

export function NotFound({
                           error,
                           resetErrorBoundary,
}: {
  error?: unknown;
  resetErrorBoundary?: () => void;
}) {
  const errorMessage =
    error instanceof Error ? error.message : 'Unexpected application error';

  return (
      <div className={styles.notFoundAlert}>
        <p className={styles.notFoundMessage}>Something went wrong:</p>
        <pre>{errorMessage}</pre>
        <button
          type="button"
          className={styles.notFoundButton}
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </div>
  );
}

export default NotFound;
