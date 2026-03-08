import type { MulphilogOptions, Result } from "./types/common.js";
import type { CNTrackingResult } from "./models/tracking.js";
import type { CNTrackingRequest } from "./endpoints/tracking.js";
import { createClientConfig, callEndpoint } from "./client.js";
import { CNTrackingEndpoint } from "./endpoints/tracking.js";

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
  };
}

// Default export for convenience
export default Mulphilog;

// Re-export types for consumers
export type { MulphilogOptions, Result } from "./types/common.js";
export type { CNTrackingRequest } from "./endpoints/tracking.js";
export type { CNTrackingResult, ShipmentDetails, TrackingEvent } from "./models/tracking.js";

// Re-export errors for consumers
export { MulphilogError, ValidationError, APIError, TimeoutError, NetworkError } from "./errors.js";
