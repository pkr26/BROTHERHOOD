import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import logger from './utils/logger';

// Log app startup
logger.info('Brotherhood app starting', {
  userAgent: navigator.userAgent,
  language: navigator.language,
  platform: navigator.platform,
  viewport: `${window.innerWidth}x${window.innerHeight}`
});

// Track performance metrics
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;

      logger.info('App performance metrics', {
        totalLoadTime: `${(loadTime / 1000).toFixed(2)}s`,
        domReadyTime: `${(domReadyTime / 1000).toFixed(2)}s`
      });

      // Warn if performance is poor
      if (loadTime > 5000) {
        logger.warn('Slow app load detected', {
          loadTime: `${(loadTime / 1000).toFixed(2)}s`
        });
      }
    }, 0);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);