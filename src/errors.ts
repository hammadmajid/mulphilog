/**
 * Base error class for all Mulphilog API errors
 */
export class MulphilogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MulphilogError";
    Object.setPrototypeOf(this, MulphilogError.prototype);
  }
}

/**
 * Error thrown when API response validation fails
 */
export class ValidationError extends MulphilogError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when HTTP/API request fails
 */
export class APIError extends MulphilogError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly statusText?: string,
  ) {
    super(message);
    this.name = "APIError";
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Error thrown when request times out
 */
export class TimeoutError extends MulphilogError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
  ) {
    super(message);
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends MulphilogError {
  public override readonly cause: Error | undefined;

  constructor(message: string, cause: Error | undefined = undefined) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
