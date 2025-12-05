// Google Analytics 4 helper functions

// Initialize GA4
export const initGA = (measurementId) => {
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID is not set');
    return;
  }

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
};

// Track page views (for React Router)
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track Google Ads conversion
export const trackGoogleAdsConversion = (conversionLabel, value = 1.0, currency = 'EUR') => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `AW-17777442875/${conversionLabel}`,
      'value': value,
      'currency': currency
    });
  }
};

