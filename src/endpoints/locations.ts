import type { EndpointConfig } from "./base.js";
import { BASE_URLS } from "../config.js";
import { buildQueryUrl } from "./base.js";
import { z } from "zod";
import {
  getLocationsResponseSchema,
  addLocationResponseSchema,
  type GetLocationsResponse,
  type AddLocationResponse,
} from "../schemas/locations.js";

/**
 * Request parameters for GetLocations/GetCities endpoints (internal use)
 */
export interface GetLocationsRequest {
  /**
   * Authentication username - provided by M&P (from client config)
   */
  username: string;

  /**
   * Authentication password - provided by M&P (from client config)
   */
  password: string;

  /**
   * Account number (parent account) - provided by M&P (from client config)
   * Note: API uses capital N in 'AccountNo'
   */
  AccountNo: string;
}

/**
 * Request parameters for AddLocation endpoint (internal use)
 */
export interface AddLocationRequest {
  /**
   * Authentication username - provided by M&P (from client config)
   * Note: API uses 'userId' instead of 'username' here
   */
  userId: string;

  /**
   * Authentication password - provided by M&P (from client config)
   */
  password: string;

  /**
   * Account number (parent account) - provided by M&P (from client config)
   */
  accountNo: string;

  /**
   * Branch code for the new location
   */
  branchCode: number;

  /**
   * Name of the new location
   */
  locationName: string;

  /**
   * Address of the new location
   */
  locationAddress: string;

  /**
   * Array of email addresses to notify ('To' field)
   */
  to: string[];

  /**
   * Array of email addresses to notify ('CC' field)
   */
  cc: string[];
}

/**
 * User-provided parameters for adding a location (excludes M&P credentials)
 */
export type AddLocationParams = Omit<AddLocationRequest, "userId" | "password" | "accountNo">;

/**
 * Get Locations endpoint configuration
 */
export const GetLocationsEndpoint: EndpointConfig<
  GetLocationsRequest,
  z.input<typeof getLocationsResponseSchema>,
  GetLocationsResponse
> = {
  baseUrl: BASE_URLS.BOOKING,
  path: "/mycodapi/api/Locations/Get_locations",
  method: "GET",

  buildUrl: (params: GetLocationsRequest): string => {
    return buildQueryUrl(BASE_URLS.BOOKING, "/mycodapi/api/Locations/Get_locations", {
      username: params.username,
      password: params.password,
      AccountNo: params.AccountNo,
    });
  },

  validate: (data: unknown) => data as z.input<typeof getLocationsResponseSchema>,

  transform: (data: unknown) => getLocationsResponseSchema.parse(data),
};

/**
 * Get Cities endpoint configuration
 */
export const GetCitiesEndpoint: EndpointConfig<
  GetLocationsRequest,
  z.input<typeof getLocationsResponseSchema>,
  GetLocationsResponse
> = {
  baseUrl: BASE_URLS.BOOKING,
  path: "/mycodapi/api/Branches/Get_Cities",
  method: "GET",

  buildUrl: (params: GetLocationsRequest): string => {
    return buildQueryUrl(BASE_URLS.BOOKING, "/mycodapi/api/Branches/Get_Cities", {
      username: params.username,
      password: params.password,
      AccountNo: params.AccountNo,
    });
  },

  validate: (data: unknown) => data as z.input<typeof getLocationsResponseSchema>,

  transform: (data: unknown) => getLocationsResponseSchema.parse(data),
};

/**
 * Add Location endpoint configuration
 */
export const AddLocationEndpoint: EndpointConfig<
  AddLocationRequest,
  z.input<typeof addLocationResponseSchema>,
  AddLocationResponse
> = {
  baseUrl: BASE_URLS.BOOKING,
  path: "/mycodapi/api/Locations/AddLocation",
  method: "POST",

  buildUrl: (_params: AddLocationRequest): string => {
    return buildQueryUrl(BASE_URLS.BOOKING, "/mycodapi/api/Locations/AddLocation", {});
  },

  validate: (data: unknown) => data as z.input<typeof addLocationResponseSchema>,

  transform: (data: unknown) => addLocationResponseSchema.parse(data),
};
