import { describe, expect, it } from "vitest";
import { MulphilogError, ValidationError } from "../../src/errors.js";

describe("MulphilogError", () => {
  it("should create error with correct message and name", () => {
    const error = new MulphilogError("Test error message");

    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("MulphilogError");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MulphilogError);
  });
});

describe("ValidationError", () => {
  it("should create error with field information", () => {
    const error = new ValidationError("Invalid field", "username");

    expect(error.message).toBe("Invalid field");
    expect(error.name).toBe("ValidationError");
    expect(error.field).toBe("username");
    expect(error).toBeInstanceOf(MulphilogError);
    expect(error).toBeInstanceOf(ValidationError);
  });
});
