/**
 * Common types used across the Mulphilog API client
 */

/**
 * Generic API result wrapper using discriminated union
 * This provides type-safe success/error handling
 */
export type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };

/**
 * Configuration options for initializing the Mulphilog API client
 */
export interface MulphilogOptions {
  /**
   * Dashboard username provided by M&P
   * Required for certain endpoints (booking, etc.)
   */
  username: string;

  /**
   * Dashboard password provided by M&P
   * Required for certain endpoints (booking, etc.)
   */
  password: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Generic error response structure
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
