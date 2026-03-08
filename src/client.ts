import type { Result, MulphilogOptions } from "./types/common.js";
import type { EndpointConfig } from "./endpoints/base.js";
import { APIError, TimeoutError, NetworkError, ValidationError, MulphilogError } from "./errors.js";
import { DEFAULT_TIMEOUT } from "./config.js";
import { ZodError } from "zod";

/**
 * Client configuration
 */
export interface ClientConfig {
  username: string;
  password: string;
  timeout: number;
}

/**
 * Convert ZodError to a user-friendly ValidationError message
 */
function formatZodError(error: ZodError): string {
  const issues = error.issues;

  // Check for specific common validation errors and provide friendly messages
  if (issues.length === 1) {
    const issue = issues[0];

    // Check if it's a root-level array error
    if (issue && issue.path.length === 0 && issue.message.includes("expected array")) {
      return "Response must be an array";
    }

    // Check for array empty error
    if (
      issue &&
      (issue.message.includes("array cannot be empty") || issue.message.includes("array is empty"))
    ) {
      return "Response array is empty";
    }

    // Check for type errors involving arrays
    if (issue && issue.message.includes("expected array")) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "field";
      return `Expected array for ${path}, but received ${issue.message.split("received ")[1] || "invalid type"}`;
    }
  }

  // Check if we have multiple missing field errors (indicates missing required fields)
  const missingFieldErrors = issues.filter(
    (issue) =>
      issue.message.includes("expected string, received undefined") ||
      issue.message.includes("required") ||
      issue.message.includes("Invalid input"),
  );

  if (missingFieldErrors.length > 0) {
    const fields = missingFieldErrors.map((issue) => {
      const path = issue.path.join(".");
      return path;
    });

    // Always use plural "fields" for consistency
    if (fields.length === 1) {
      return `Missing required fields: ${fields[0]}`;
    } else if (fields.length <= 5) {
      return `Missing required fields: ${fields.join(", ")}`;
    } else {
      return `Missing required fields (${fields.length} total). First few: ${fields.slice(0, 3).join(", ")}`;
    }
  }

  // Default: format all errors
  const errors = issues.map((err) => {
    const path = err.path.length > 0 ? err.path.join(".") : "root";
    return `${path}: ${err.message}`;
  });

  if (errors.length === 0) {
    return "Validation failed";
  }

  if (errors.length === 1) {
    return errors[0] || "Validation failed";
  }

  return `Validation failed with ${errors.length} errors:\n${errors.map((e: string) => `  - ${e}`).join("\n")}`;
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

      // Transform to clean model - wrap in try-catch to handle ZodError
      try {
        const transformedData = endpoint.transform(validatedData);

        return {
          ok: true,
          data: transformedData,
        };
      } catch (error) {
        // Handle Zod validation errors
        if (error instanceof ZodError) {
          return {
            ok: false,
            error: new ValidationError(formatZodError(error)),
          };
        }
        throw error;
      }
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
