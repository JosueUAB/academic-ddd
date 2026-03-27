import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

/**
 * Custom hook that uses React Router to track page views automatically
 * every time the user navigates across the React application.
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};

/**
 * Component version of the hook to be easily placed inside the Router context.
 */
export const PageTracker = () => {
  usePageTracking();
  return null;
};
