import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {ErrorBoundary} from 'react-error-boundary';
import {NotFound} from "./components/NotFound";

const rootElement = document.querySelector('#root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

function logErrorToService(error: any, info: any) {
  // Use your preferred error logging service
  console.error('Caught an error:', error, info);
}

root.render(
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={NotFound} onError={logErrorToService}>
        <App/>
      </ErrorBoundary>
    </React.StrictMode>
);
