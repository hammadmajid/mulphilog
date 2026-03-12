import type { MulphilogOptions, Result } from "./types/common.js";
import type { CNTrackingResult } from "./models/tracking.js";
import type { CNTrackingRequest } from "./endpoints/tracking.js";
import type { BookingParams, BookingRequest } from "./endpoints/booking.js";
import type { BookingResponse } from "./schemas/booking.js";
import type { GetLocationsResponse, AddLocationResponse } from "./schemas/locations.js";
import { createClientConfig, callEndpoint } from "./client.js";
import { CNTrackingEndpoint } from "./endpoints/tracking.js";
import { BookingEndpoint } from "./endpoints/booking.js";
import {
  GetLocationsEndpoint,
  GetCitiesEndpoint,
  AddLocationEndpoint,
  type AddLocationParams,
  type AddLocationRequest,
  type GetLocationsRequest,
} from "./endpoints/locations.js";

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

  /**
   * Get list of locations for the account
   * @returns Result containing locations list or error
   */
  getLocations(): Promise<Result<GetLocationsResponse>>;

  /**
   * Add a new location to the account
   * @param params - Location details (user-provided fields only)
   * @returns Result containing confirmation or error
   */
  addLocation(params: AddLocationParams): Promise<Result<AddLocationResponse>>;

  /**
   * Get list of cities
   * @returns Result containing cities list or error
   */
  getCities(): Promise<Result<GetLocationsResponse>>;
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
        InsertType: config.insertType,
        ReturnLocation: config.returnLocation,
        subAccountId: config.subAccountId,
        // User provided shipment details (including locationID)
        ...params,
      };
      return callEndpoint(config, BookingEndpoint, fullParams);
    },

    /**
     * Get list of locations for the account
     */
    async getLocations(): Promise<Result<GetLocationsResponse>> {
      const params: GetLocationsRequest = {
        username: config.username,
        password: config.password,
        AccountNo: config.accountNo,
      };
      return callEndpoint(config, GetLocationsEndpoint, params);
    },

    /**
     * Add a new location to the account
     */
    async addLocation(params: AddLocationParams): Promise<Result<AddLocationResponse>> {
      const fullParams: AddLocationRequest = {
        userId: config.username,
        password: config.password,
        accountNo: config.accountNo,
        ...params,
      };
      return callEndpoint(config, AddLocationEndpoint, fullParams);
    },

    /**
     * Get list of cities
     */
    async getCities(): Promise<Result<GetLocationsResponse>> {
      const params: GetLocationsRequest = {
        username: config.username,
        password: config.password,
        AccountNo: config.accountNo,
      };
      return callEndpoint(config, GetCitiesEndpoint, params);
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
export type { GetLocationsResponse, AddLocationResponse, Location } from "./schemas/locations.js";
export type { AddLocationParams } from "./endpoints/locations.js";
export type { BookingResponse } from "./schemas/booking.js";

// Re-export errors for consumers
export { MulphilogError, ValidationError, APIError, TimeoutError, NetworkError } from "./errors.js";
