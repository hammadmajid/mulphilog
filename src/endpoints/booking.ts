import type { EndpointConfig } from "./base.js";
import type { BookingResponse } from "../schemas/booking.js";
import { BASE_URLS } from "../config.js";
import { buildQueryUrl } from "./base.js";
import { bookingResponseSchema } from "../schemas/booking.js";

/**
 * Request parameters for Booking endpoint
 */
export interface BookingRequest {
  /**
   * Get from the client configuration
   */
  username: string;

  /**
   * Get from the client configuration
   */
  password: string;

  /**
   * Name of the receiver
   */
  consigneeName: string;

  /**
   * Address of the receiver
   */
  consigneeAddress: string;

  /**
   * Mobile number of the receiver
   */
  consigneeMobNo: string;

  /**
   * Email of the receiver
   */
  consigneeEmail: string;

  /**
   * City name of the receiver
   */
  destinationCityName: string;

  /**
   * Number of items in the shipment
   */
  pieces: number;

  /**
   * Total weight of the shipment in kg
   */
  weight: number;

  /**
   * Amount to be collected on delivery (COD) in PKR
   */
  codAmount: number;

  /**
   * Shipper's own reference ID. Max char 50
   */
  custRefNo: string;

  /**
   * Nature and details of the product being shipped. Max char 50
   */
  productDetails: string;

  /**
   * Whether the shipment is fragile or not
   */
  fragile: "YES" | "NO";

  /**
   * Type of service for the shipment
   */
  service: "Overnight" | "Second Day";

  /**
   * Remarks provided by the shipper. Max char 400
   */
  remarks: string;

  /**
   * Insurance value - 0 in case no insurance or amount if insured
   */
  insuranceValue: string;

  /**
   * Location ID provided by M&P. Max length: 10
   */
  locationID: string;

  /**
   * Account number provided by M&P. Max length: 50
   * Note: API uses capital N in 'AccountNo'
   */
  AccountNo: string;

  /**
   * Insert type provided by M&P. Max length: 6
   */
  InsertType: number;

  /**
   * Return location ID
   */
  ReturnLocation: number;

  /**
   * Sub-account ID
   */
  subAccountId: number;
}

/**
 * Booking endpoint configuration
 */
export const BookingEndpoint: EndpointConfig<BookingRequest, unknown, BookingResponse> = {
  baseUrl: BASE_URLS.BOOKING,
  path: "/mycodapi/api/Booking/InsertBookingData",
  method: "POST",

  buildUrl: (_params: BookingRequest): string => {
    return buildQueryUrl(BASE_URLS.BOOKING, "/mycodapi/api/Booking/InsertBookingData", {});
  },

  validate: (data: unknown) => data,

  transform: (data: unknown) => bookingResponseSchema.parse(data),
};
