import type { MulphilogOptions, Result } from "./types/common.js";
import type { CNTrackingResult } from "./models/tracking.js";
import type { CNTrackingRequest } from "./endpoints/tracking.js";
import type { BookingParams, BookingRequest } from "./endpoints/booking.js";
import type { BookingResponse } from "./schemas/booking.js";
import { createClientConfig, callEndpoint } from "./client.js";
import { CNTrackingEndpoint } from "./endpoints/tracking.js";
import { BookingEndpoint } from "./endpoints/booking.js";

/**
 * Mulphilog API client interface
 */
interface MulphilogClient {
  /**
   * Track a shipment by consignment number
   * @param params - Tracking request parameters
   * @returns Result containing tracking information or error
   */
  track(params: CNTrackingRequest): Promise<Result<CNTrackingResult>>;

  /**
   * Create a new booking/shipment
   * @param params - Booking request parameters (user-provided fields only)
   * @returns Result containing booking confirmation or error
   */
  booking(params: BookingParams): Promise<Result<BookingResponse>>;
}

/**
 * Create a Mulphilog API client
 * @param options - Client configuration options
 * @returns Mulphilog client instance
 */
export function Mulphilog(options: MulphilogOptions): MulphilogClient {
  const config = createClientConfig(options);

  return {
    /**
     * Track a shipment by consignment number
     */
    async track(params: CNTrackingRequest): Promise<Result<CNTrackingResult>> {
      return callEndpoint(config, CNTrackingEndpoint, params);
    },

    /**
     * Create a new booking/shipment
     * Automatically injects M&P provided credentials from client config
     */
    async booking(params: BookingParams): Promise<Result<BookingResponse>> {
      const fullParams: BookingRequest = {
        // M&P provided credentials (from config)
        username: config.username,
        password: config.password,
        AccountNo: config.accountNo,
        locationID: config.locationID,
        InsertType: config.insertType,
        ReturnLocation: config.returnLocation,
        subAccountId: config.subAccountId,
        // User provided shipment details
        ...params,
      };
      return callEndpoint(config, BookingEndpoint, fullParams);
    },
  };
}

// Default export for convenience
export default Mulphilog;

// Re-export types for consumers
export type { MulphilogOptions, Result } from "./types/common.js";
export type { CNTrackingRequest } from "./endpoints/tracking.js";
export type { CNTrackingResult, ShipmentDetails, TrackingEvent } from "./models/tracking.js";
export type { BookingParams } from "./endpoints/booking.js";
export type { BookingResponse } from "./schemas/booking.js";

// Re-export errors for consumers
export { MulphilogError, ValidationError, APIError, TimeoutError, NetworkError } from "./errors.js";
