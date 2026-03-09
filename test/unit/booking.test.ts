import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { Mulphilog } from "../../src/index.js";
import { ValidationError, APIError, TimeoutError, NetworkError } from "../../src/errors.js";
import {
  validBookingResponse,
  validBookingResponse2,
  failedBookingResponseAuth,
  failedBookingResponseInvalidCity,
  failedBookingResponseInvalidAccount,
  invalidBookingResponseNotArray,
  invalidBookingResponseEmptyArray,
  invalidBookingResponseMissingFields,
  invalidBookingResponseWrongTypes,
  bookingParamsWithoutAuth,
} from "../fixtures/booking.js";

describe("booking() function", () => {
  const mockConfig = {
    username: "test_user",
    password: "12345",
    timeout: 5000,
  };

  // Mock global fetch
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Successful booking scenarios", () => {
    it("should successfully create a booking with valid data", async () => {
      // Mock successful API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      // Verify response structure
      expect(result.data.isSuccess).toBe("true");
      expect(result.data.message).toBe("Order saved successfully!");
      expect(result.data.orderReferenceId).toBe("544794010101495");
    });

    it("should create multiple bookings with different order IDs", async () => {
      // First booking
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });

      const client = Mulphilog(mockConfig);
      const result1 = await client.booking(bookingParamsWithoutAuth);

      expect(result1.ok).toBe(true);
      if (!result1.ok) return;
      expect(result1.data.orderReferenceId).toBe("544794010101495");

      // Second booking
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse2,
      });

      const result2 = await client.booking({
        ...bookingParamsWithoutAuth,
        custRefNo: "test_5678",
      });

      expect(result2.ok).toBe(true);
      if (!result2.ok) return;
      expect(result2.data.orderReferenceId).toBe("544794010101496");
    });

    it("should automatically inject username and password from config", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking(bookingParamsWithoutAuth);

      // Verify that fetch was called with POST method and body containing credentials
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"username":"test_user"'),
        }),
      );

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.username).toBe("test_user");
      expect(body.password).toBe("12345");
    });

    it("should send booking data as JSON in request body", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking(bookingParamsWithoutAuth);

      // Verify request structure
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.any(String),
        }),
      );

      // Verify all booking fields are in the body
      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.consigneeName).toBe("Aleeza Moazzam");
      expect(body.consigneeAddress).toBe("DHA KHI");
      expect(body.consigneeMobNo).toBe("03134568904");
      expect(body.destinationCityName).toBe("islamabad");
      expect(body.pieces).toBe(1);
      expect(body.weight).toBe(1);
      expect(body.codAmount).toBe(1);
      expect(body.fragile).toBe("YES");
      expect(body.service).toBe("Overnight");
      expect(body.AccountNo).toBe("4T154");
      expect(body.InsertType).toBe(19);
      expect(body.ReturnLocation).toBe(41);
      expect(body.subAccountId).toBe(2);
    });

    it("should handle Second Day service correctly", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking({
        ...bookingParamsWithoutAuth,
        service: "Second Day",
      });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.service).toBe("Second Day");
    });

    it("should handle non-fragile items correctly", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking({
        ...bookingParamsWithoutAuth,
        fragile: "NO",
      });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.fragile).toBe("NO");
    });
  });

  describe("Failed booking scenarios", () => {
    it("should handle authentication failure", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => failedBookingResponseAuth,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      // API returns success=false for auth failures
      expect(result.data.isSuccess).toBe("false");
      expect(result.data.message).toBe("Invalid username or password");
      expect(result.data.orderReferenceId).toBe("");
    });

    it("should handle invalid destination city", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => failedBookingResponseInvalidCity,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.data.isSuccess).toBe("false");
      expect(result.data.message).toBe("Invalid destination city");
    });

    it("should handle invalid account number", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => failedBookingResponseInvalidAccount,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.data.isSuccess).toBe("false");
      expect(result.data.message).toBe("Invalid account number");
    });
  });

  describe("HTTP error scenarios", () => {
    it("should handle 400 Bad Request", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect(result.error.message).toContain("400");
      expect(result.error.message).toContain("Bad Request");
    });

    it("should handle 401 Unauthorized", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect(result.error.message).toContain("401");
    });

    it("should handle 500 Internal Server Error", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect(result.error.message).toContain("500");
    });

    it("should handle 503 Service Unavailable", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect(result.error.message).toContain("503");
    });
  });

  describe("Validation error scenarios", () => {
    it("should handle response that is not an array", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidBookingResponseNotArray,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("array");
    });

    it("should handle empty array response", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidBookingResponseEmptyArray,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("empty");
    });

    it("should handle missing required fields in response", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidBookingResponseMissingFields,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("Missing required fields");
    });

    it("should handle wrong field types in response", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidBookingResponseWrongTypes,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
    });
  });

  describe("Network error scenarios", () => {
    it("should handle network timeout", async () => {
      (global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            const error = new Error("The operation was aborted");
            error.name = "AbortError";
            reject(error);
          }),
      );

      const client = Mulphilog({ ...mockConfig, timeout: 100 });
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(TimeoutError);
      expect(result.error.message).toContain("timeout");
      expect(result.error.message).toContain("100");
    });

    it("should handle network connection failure", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network connection failed"));

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
      expect(result.error.message).toContain("Network");
    });

    it("should handle DNS resolution failure", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("getaddrinfo ENOTFOUND"));

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
      expect(result.error.message).toContain("Network");
    });

    it("should handle JSON parsing errors", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => {
          throw new Error("Unexpected token in JSON");
        },
      });

      const client = Mulphilog(mockConfig);
      const result = await client.booking(bookingParamsWithoutAuth);

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
    });
  });

  describe("Edge cases", () => {
    it("should handle very large COD amounts", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking({
        ...bookingParamsWithoutAuth,
        codAmount: 999999,
      });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.codAmount).toBe(999999);
    });

    it("should handle multiple pieces", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking({
        ...bookingParamsWithoutAuth,
        pieces: 100,
        weight: 50.5,
      });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.pieces).toBe(100);
      expect(body.weight).toBe(50.5);
    });

    it("should handle long reference numbers (up to 50 chars)", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const longRef = "A".repeat(50);
      const client = Mulphilog(mockConfig);
      await client.booking({
        ...bookingParamsWithoutAuth,
        custRefNo: longRef,
      });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.custRefNo).toBe(longRef);
      expect(body.custRefNo.length).toBe(50);
    });

    it("should handle long remarks (up to 400 chars)", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const longRemarks = "X".repeat(400);
      const client = Mulphilog(mockConfig);
      await client.booking({
        ...bookingParamsWithoutAuth,
        remarks: longRemarks,
      });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body.remarks).toBe(longRemarks);
      expect(body.remarks.length).toBe(400);
    });

    it("should correctly use the booking API endpoint", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validBookingResponse,
      });
      global.fetch = fetchMock;

      const client = Mulphilog(mockConfig);
      await client.booking(bookingParamsWithoutAuth);

      // Verify the correct URL is called
      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[0]).toContain("mnpcourier.com");
      expect(callArgs[0]).toContain("/mycodapi/api/Booking/InsertBookingData");
    });
  });
});
