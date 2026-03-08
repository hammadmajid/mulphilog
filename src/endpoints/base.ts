import type { Result } from "../types/common.js";

/**
 * Base configuration for an API endpoint
 * @template TRequest - The request parameters type
 * @template TRawResponse - The raw API response type
 * @template TResult - The transformed/clean result type
 */
export interface EndpointConfig<TRequest, TRawResponse, TResult> {
  /**
   * Base URL for this endpoint (may vary by subdomain)
   */
  baseUrl: string;

  /**
   * API path
   */
  path: string;

  /**
   * HTTP method
   */
  method: "GET" | "POST" | "PUT" | "DELETE";

  /**
   * Build the full URL with query parameters or body
   */
  buildUrl: (params: TRequest) => string;

  /**
   * Validate and parse the raw API response
   * Throws ValidationError if response doesn't match expected structure
   */
  validate: (data: unknown) => TRawResponse;

  /**
   * Transform raw API response into clean, usable format
   */
  transform: (data: TRawResponse) => TResult;
}

/**
 * Helper function to build URL with query parameters
 */
export function buildQueryUrl(
  baseUrl: string,
  path: string,
  params: Record<string, string>,
): string {
  const url = new URL(path, baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

/**
 * Execute an endpoint call and return a Result type
 */
export type EndpointExecutor = <TRequest, TRawResponse, TResult>(
  config: EndpointConfig<TRequest, TRawResponse, TResult>,
  params: TRequest,
) => Promise<Result<TResult>>;
