export type AnalyticsEventName = 'cta_clicked' | 'quote_started' | 'quote_submitted';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  properties?: {
    placement?: string;
    outcome?: 'success' | 'error';
    route?: string;
  };
};

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void;
}
