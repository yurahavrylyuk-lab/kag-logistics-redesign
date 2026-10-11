export type AnalyticsEventName = 'quote_started' | 'quote_step_completed' | 'quote_submitted' | 'quote_failed' | 'solution_viewed' | 'technology_cta_clicked' | 'carrier_cta_clicked' | 'careers_cta_clicked' | 'theme_changed';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  properties?: {
    source?: string;
    entryPoint?: string;
    freightType?: string;
    step?: number;
    elapsedMs?: number;
    validationErrorCount?: number;
    referenceId?: string;
    failureKind?: 'validation' | 'server' | 'network';
    solutionId?: string;
    theme?: 'light' | 'dark' | 'system';
  };
};

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void;
}
