/**
 * Configuration constants for the Mulphilog API client
 */

/**
 * Default request timeout in milliseconds
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * Base URLs for different Mulphilog API endpoints
 * Note: Different endpoints may use different subdomains
 */
export const BASE_URLS = {
  TRACKING: "https://tracking.mulphilog.com.pk",
  // Future endpoints can be added here:
  // BOOKING: "https://booking.mulphilog.com.pk",
  // API: "https://api.mulphilog.com.pk",
} as const;

/**
 * API constant values
 */
export const API_CONSTANTS = {
  /**
   * Tracking ID parameter - always "4" per API documentation
   */
  TRACKING_ID: "4",
} as const;
