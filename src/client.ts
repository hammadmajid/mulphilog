import type { MulphilogOptions, Result } from "./types/common.js";
import type { EndpointConfig } from "./endpoints/base.js";
import { APIError, MulphilogError, NetworkError, TimeoutError, ValidationError } from "./errors.js";
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

    // Check for array minimum length error (must be before the "expected array" check)
    if (issue?.code === "too_small" && issue.path.length === 0) {
      return "Response array is empty";
    }

    // Check if it's a root-level array error
    if (issue?.path.length === 0 && issue.message.includes("expected array")) {
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
    if (issue?.message?.includes("expected array") === true) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "field";
      return `Expected array for ${path}, but received ${issue.message.split("received ")[1] ?? "invalid type"}`;
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
      return issue.path.join(".");
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
    return errors[0] ?? "Validation failed";
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
    const url = endpoint.buildUrl(params);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    // For POST/PUT requests, send params as JSON body
    // For GET/DELETE requests, params are already in the URL
    const fetchOptions: RequestInit = {
      method: endpoint.method,
      headers,
      signal: controller.signal,
    };

    if (endpoint.method === "POST" || endpoint.method === "PUT") {
      fetchOptions.body = JSON.stringify(params);
    }

    const response = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

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

    const rawData: unknown = await response.json();

    const validatedData = endpoint.validate(rawData);

    const transformedData = endpoint.transform(validatedData);

    return {
      ok: true,
      data: transformedData,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        ok: false,
        error,
      };
    }

    if (error instanceof ZodError) {
      return {
        ok: false,
        error: new ValidationError(formatZodError(error)),
      };
    }

    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: new TimeoutError(`Request timeout after ${config.timeout}ms`, config.timeout),
      };
    }

    if (error instanceof MulphilogError) {
      return {
        ok: false,
        error,
      };
    }

    if (error instanceof Error) {
      return {
        ok: false,
        error: new NetworkError(`Network request failed: ${error.message}`, error),
      };
    }

    return {
      ok: false,
      error: new MulphilogError("Unknown error occurred"),
    };
  }
}
