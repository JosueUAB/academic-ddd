import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_ID || import.meta.env.VITE_GA_MEASUREMENT_ID) as string | undefined;
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;

let mixpanelInited = false;
let gaInited = false;

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && !gaInited) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    gaInited = true;
  }

  if (MIXPANEL_TOKEN && !mixpanelInited) {
    mixpanel.init(MIXPANEL_TOKEN, {
      track_pageview: false,
      persistence: 'localStorage',
    });
    mixpanelInited = true;
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && gaInited) {
    ReactGA.send({ hitType: 'pageview', page: path, title: title });
  }

  if (MIXPANEL_TOKEN && mixpanelInited) {
    mixpanel.track('page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && gaInited) {
    ReactGA.event(action, params as any);
  }

  if (MIXPANEL_TOKEN && mixpanelInited) {
    mixpanel.track(action, params ?? {});
  }
}

