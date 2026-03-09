import type { MulphilogOptions, Result } from "./types/common.js";
import type { CNTrackingResult } from "./models/tracking.js";
import type { CNTrackingRequest } from "./endpoints/tracking.js";
import type { BookingRequest } from "./endpoints/booking.js";
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
   * @param params - Booking request parameters
   * @returns Result containing booking confirmation or error
   */
  booking(params: Omit<BookingRequest, "username" | "password">): Promise<Result<BookingResponse>>;
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
     */
    async booking(
      params: Omit<BookingRequest, "username" | "password">,
    ): Promise<Result<BookingResponse>> {
      const fullParams: BookingRequest = {
        username: config.username,
        password: config.password,
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
export type { BookingRequest } from "./endpoints/booking.js";
export type { BookingResponse } from "./schemas/booking.js";

// Re-export errors for consumers
export { MulphilogError, ValidationError, APIError, TimeoutError, NetworkError } from "./errors.js";
