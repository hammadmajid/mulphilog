import type { Result, MulphilogOptions } from "./types/common.js";
import type { EndpointConfig } from "./endpoints/base.js";
import { APIError, TimeoutError, NetworkError, ValidationError, MulphilogError } from "./errors.js";
import { DEFAULT_TIMEOUT } from "./config.js";

/**
 * Client configuration
 */
export interface ClientConfig {
  username: string;
  password: string;
  timeout: number;
}

/**
 * Create a client configuration from user options
 */
export function createClientConfig(options: MulphilogOptions): ClientConfig {
  return {
    username: options.username,
    password: options.password,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
  };
}

/**
 * Execute an endpoint call with full type safety
 * Returns a Result type for safe error handling
 */
export async function callEndpoint<TRequest, TRawResponse, TResult>(
  config: ClientConfig,
  endpoint: EndpointConfig<TRequest, TRawResponse, TResult>,
  params: TRequest,
): Promise<Result<TResult>> {
  try {
    // Build the URL
    const url = endpoint.buildUrl(params);

    // Setup fetch options
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      // Make the request
      const response = await fetch(url, {
        method: endpoint.method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check for HTTP errors
      if (!response.ok) {
        return {
          ok: false,
          error: new APIError(
            `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            response.statusText,
          ),
        };
      }

      // Parse JSON response
      const rawData: unknown = await response.json();

      // Validate response structure
      const validatedData = endpoint.validate(rawData);

      // Transform to clean model
      const transformedData = endpoint.transform(validatedData);

      return {
        ok: true,
        data: transformedData,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        return {
          ok: false,
          error: new TimeoutError(`Request timeout after ${config.timeout}ms`, config.timeout),
        };
      }

      // Re-throw validation errors
      if (error instanceof ValidationError) {
        return {
          ok: false,
          error,
        };
      }

      // Handle network errors
      if (error instanceof Error) {
        return {
          ok: false,
          error: new NetworkError(`Network request failed: ${error.message}`, error),
        };
      }

      // Unknown error
      return {
        ok: false,
        error: new MulphilogError("Unknown error occurred"),
      };
    }
  } catch (error) {
    // Handle any unexpected errors in URL building or setup
    if (error instanceof MulphilogError) {
      return {
        ok: false,
        error,
      };
    }

    return {
      ok: false,
      error: new MulphilogError(error instanceof Error ? error.message : "Unknown error"),
    };
  }
}
