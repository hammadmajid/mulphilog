import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { Mulphilog } from "../../src/index.js";
import { ValidationError, APIError, TimeoutError, NetworkError } from "../../src/errors.js";
import {
  validTrackingResponseComplete,
  validTrackingResponseMinimal,
  notFoundTrackingResponse,
  invalidResponseNotArray,
  invalidResponseEmptyArray,
  invalidResponseMissingFields,
  invalidResponseMissingTrackingFields,
  invalidResponseWrongTypes,
  invalidResponseMissingEventFields,
  invalidDateFormatsResponse,
} from "../fixtures/tracking.js";

describe("track() function", () => {
  const mockConfig = {
    username: "test-user",
    password: "test-pass",
    timeout: 5000,
  };

  // Mock global fetch
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Successful tracking scenarios", () => {
    it("should successfully track a consignment with complete data", async () => {
      // Mock successful API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "54479410537894" });

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      // Verify top-level result
      expect(result.data.success).toBe(true);
      expect(result.data.message).toBe("Consignment tracking details retrieved successfully");
      expect(result.data.shipment).toBeDefined();

      const shipment = result.data.shipment!;

      // Verify basic shipment information
      expect(shipment.consignmentNumber).toBe("54479410537894");
      expect(shipment.orderID).toBe("ORD-12345");
      expect(shipment.originCity).toBe("Karachi");
      expect(shipment.destinationCity).toBe("Lahore");
      expect(shipment.consigneeName).toBe("John Doe");
      expect(shipment.consignerName).toBe("Jane Smith");
      expect(shipment.deliveryAddress).toBe("123 Main Street, Gulberg");

      // Verify dates are transformed to Date objects
      expect(shipment.bookingDate).toBeInstanceOf(Date);
      expect(shipment.bookingDate.toISOString()).toContain("2025-02");

      // Verify numeric transformations
      expect(shipment.codAmount).toBe(5000);
      expect(shipment.weight).toBe(2.5);
      expect(shipment.pieces).toBe(3);

      // Verify optional fields
      expect(shipment.contactNo).toBe("+92-300-1234567");
      expect(shipment.customerName).toBe("ABC Company");
      expect(shipment.customerAccountNo).toBe("ACC-001");
      expect(shipment.serviceType).toBe("Express");
      expect(shipment.specialInstruction).toBe("Handle with care");

      // Verify delivery information
      expect(shipment.delivery.handOverDate).toBeInstanceOf(Date);
      expect(shipment.delivery.deliveryRider).toBe("Ali Khan");
      expect(shipment.delivery.deliveryRiderContact).toBe("+92-301-7654321");

      // Verify invoice information
      expect(shipment.invoice.invoiceNumber).toBe("INV-2025-001");
      expect(shipment.invoice.invoiceDate).toBeInstanceOf(Date);
      expect(shipment.invoice.amountInvoiced).toBe(500);

      // Verify return receipt information
      expect(shipment.returnReceipt.rrNo).toBe("RR-001");
      expect(shipment.returnReceipt.rrDate).toBeInstanceOf(Date);
      expect(shipment.returnReceipt.rrUser).toBe("admin");
      expect(shipment.returnReceipt.rrBranch).toBe("Lahore Main");

      // Verify payment information
      expect(shipment.payment.paymentID).toBe("PAY-001");
      expect(shipment.payment.instrumentNumber).toBe("CHQ-12345");
      expect(shipment.payment.paymentDate).toBeInstanceOf(Date);
      expect(shipment.payment.amountPaid).toBe(5500);
      expect(shipment.payment.adjustedPaymentID).toBe("APAY-001");
      expect(shipment.payment.adjustedPaymentDate).toBeInstanceOf(Date);

      // Verify tracking history
      expect(shipment.trackingHistory).toHaveLength(3);

      const firstEvent = shipment.trackingHistory[0];
      // @ts-ignore
      expect(firstEvent.trackingTagID).toBe("TRK-001");
      // @ts-ignore
      expect(firstEvent.transactionTime).toBeInstanceOf(Date);
      // @ts-ignore
      expect(firstEvent.location).toBe("Karachi Hub");
      // @ts-ignore
      expect(firstEvent.trackingStatus).toBe("Booked");
      // @ts-ignore
      expect(firstEvent.trackingNarration).toBe("Shipment booked successfully");
      // @ts-ignore
      expect(firstEvent.event).toBe("BOOKING");

      const lastEvent = shipment.trackingHistory[2];
      // @ts-ignore
      expect(lastEvent.trackingStatus).toBe("Delivered");
      // @ts-ignore
      expect(lastEvent.event).toBe("DELIVERED");

      // Verify invoice details array
      expect(shipment.invoiceDetails).toEqual([]);
    });

    it("should successfully track a consignment with minimal data", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseMinimal,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.data.success).toBe(true);
      expect(result.data.shipment).toBeDefined();

      const shipment = result.data.shipment!;

      // Verify required fields
      expect(shipment.consignmentNumber).toBe("12345678901234");
      expect(shipment.originCity).toBe("Islamabad");
      expect(shipment.destinationCity).toBe("Rawalpindi");

      // Verify optional fields are undefined (not null)
      expect(shipment.orderID).toBeUndefined();
      expect(shipment.codAmount).toBeUndefined();
      expect(shipment.weight).toBeUndefined();
      expect(shipment.pieces).toBeUndefined();
      expect(shipment.contactNo).toBeUndefined();
      expect(shipment.customerName).toBeUndefined();
      expect(shipment.serviceType).toBeUndefined();

      // Verify delivery info with null values
      expect(shipment.delivery.handOverDate).toBeUndefined();
      expect(shipment.delivery.deliveryRider).toBeUndefined();

      // Verify tracking history with minimal data
      expect(shipment.trackingHistory).toHaveLength(1);
      const event = shipment.trackingHistory[0];
      // @ts-ignore
      expect(event.trackingTagID).toBe("TRK-MINIMAL");
      // @ts-ignore
      expect(event.location).toBeUndefined();
      // @ts-ignore
      expect(event.event).toBeUndefined();
    });

    it("should handle consignment not found response", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => notFoundTrackingResponse,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "99999999999999" });

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.data.success).toBe(false);
      expect(result.data.message).toBe("Consignment not found");
      expect(result.data.shipment).toBeUndefined();
    });
  });

  describe("Validation error scenarios", () => {
    it("should return validation error when response is not an array", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidResponseNotArray,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("must be an array");
    });

    it("should return validation error when response array is empty", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidResponseEmptyArray,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("array is empty");
    });

    it("should return validation error when response item is missing required fields", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidResponseMissingFields,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("Missing required fields");
    });

    it("should return validation error when tracking detail is missing required fields", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidResponseMissingTrackingFields,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("Missing required fields");
    });

    it("should return validation error when field has wrong type", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidResponseWrongTypes,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("array");
    });

    it("should return validation error when tracking event is missing required fields", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidResponseMissingEventFields,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("Missing required fields");
    });

    it("should return validation error when date formats are invalid", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => invalidDateFormatsResponse,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toContain("date");
    });
  });

  describe("API error scenarios", () => {
    it("should return API error when response status is 404", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({}),
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect(result.error.message).toContain("404");
      expect(result.error.message).toContain("Not Found");
      expect((result.error as APIError).statusCode).toBe(404);
      expect((result.error as APIError).statusText).toBe("Not Found");
    });

    it("should return API error when response status is 500", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({}),
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect((result.error as APIError).statusCode).toBe(500);
      expect(result.error.message).toContain("500");
    });

    it("should return API error when response status is 401 Unauthorized", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({}),
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(APIError);
      expect((result.error as APIError).statusCode).toBe(401);
      expect(result.error.message).toContain("Unauthorized");
    });
  });

  describe("Timeout scenarios", () => {
    it("should return timeout error when request takes too long", async () => {
      // Mock AbortController to simulate timeout
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";

      (global.fetch as any).mockRejectedValueOnce(abortError);

      const client = Mulphilog({ ...mockConfig, timeout: 100 });
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(TimeoutError);
      expect(result.error.message).toContain("timeout");
    });

    it("should use default timeout when not specified", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog({
        username: "test",
        password: "test",
      });

      await client.track({ consignment: "12345678901234" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });
  });

  describe("Network error scenarios", () => {
    it("should return network error when fetch fails", async () => {
      const networkError = new Error("Failed to fetch");
      (global.fetch as any).mockRejectedValueOnce(networkError);

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
      expect(result.error.message).toContain("Network request failed");
      expect((result.error as NetworkError).cause).toBe(networkError);
    });

    it("should return network error when DNS resolution fails", async () => {
      const dnsError = new Error("getaddrinfo ENOTFOUND");
      (global.fetch as any).mockRejectedValueOnce(dnsError);

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
      expect(result.error.message).toContain("Network request failed");
    });

    it("should return network error when connection is refused", async () => {
      const connectionError = new Error("ECONNREFUSED");
      (global.fetch as any).mockRejectedValueOnce(connectionError);

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
    });

    it("should handle JSON parsing errors", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      expect(result.ok).toBe(false);
      if (result.ok) return;

      expect(result.error).toBeInstanceOf(NetworkError);
      expect(result.error.message).toContain("Network request failed");
    });
  });

  describe("Request building", () => {
    it("should build correct URL with consignment parameter", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog(mockConfig);
      await client.track({ consignment: "54479410537894" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("consignment=54479410537894"),
        expect.any(Object),
      );
    });

    it("should include tracking ID in URL", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog(mockConfig);
      await client.track({ consignment: "12345678901234" });

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("id="), expect.any(Object));
    });

    it("should use GET method for tracking requests", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog(mockConfig);
      await client.track({ consignment: "12345678901234" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
        }),
      );
    });

    it("should include Content-Type header", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog(mockConfig);
      await client.track({ consignment: "12345678901234" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });
  });

  describe("Type safety", () => {
    it("should maintain type safety with Result type", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => validTrackingResponseComplete,
      });

      const client = Mulphilog(mockConfig);
      const result = await client.track({ consignment: "12345678901234" });

      // Type guard check
      if (result.ok) {
        expect(result.data.success).toBeDefined();
        expect(result.data.message).toBeDefined();
      } else {
        expect(result.error).toBeInstanceOf(Error);
      }
    });
  });
});
