import { ValidationError } from "../errors.js";

/**
 * Type guard to check if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard to check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Validate that a field exists and is not null/undefined
 */
export function validateRequired<T>(
  value: T,
  fieldName: string
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new ValidationError(`Required field '${fieldName}' is missing`, fieldName);
  }
}

/**
 * Parse a string to number, returning undefined if null/empty/invalid
 */
export function parseNumber(value: string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parse a date string in "DD MMM YYYY" format (e.g., "20 Feb 2025")
 * Returns a Date object or throws if invalid
 */
export function parseDate(value: string): Date {
  if (!value || typeof value !== "string") {
    throw new ValidationError(`Invalid date value: ${value}`);
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Unable to parse date: ${value}`);
  }
  
  return date;
}

/**
 * Parse a datetime string in "MM/DD/YYYY HH:mm:ss" format
 * Returns a Date object or throws if invalid
 */
export function parseDateTime(value: string): Date {
  if (!value || typeof value !== "string") {
    throw new ValidationError(`Invalid datetime value: ${value}`);
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Unable to parse datetime: ${value}`);
  }
  
  return date;
}

/**
 * Parse a boolean-like string ("true"/"false") to boolean
 */
export function parseBoolean(value: string): boolean {
  return value === "true";
}

/**
 * Safely get a string value from an object, with optional default
 */
export function getString(
  obj: Record<string, unknown>,
  key: string,
  defaultValue: string | undefined = undefined
): string | undefined {
  const value = obj[key];
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value !== "string") {
    throw new ValidationError(`Expected string for field '${key}', got ${typeof value}`, key);
  }
  return value;
}

/**
 * Safely get an object value from an object
 */
export function getObject(
  obj: Record<string, unknown>,
  key: string
): Record<string, unknown> {
  const value = obj[key];
  if (!isObject(value)) {
    throw new ValidationError(`Expected object for field '${key}'`, key);
  }
  return value;
}

/**
 * Safely get an array value from an object
 */
export function getArray(
  obj: Record<string, unknown>,
  key: string
): unknown[] {
  const value = obj[key];
  if (!isArray(value)) {
    throw new ValidationError(`Expected array for field '${key}'`, key);
  }
  return value;
}
