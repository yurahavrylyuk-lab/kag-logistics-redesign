import type { AnalyticsAdapter } from './types';

export const noopAnalyticsAdapter: AnalyticsAdapter = {
  track() {},
};
