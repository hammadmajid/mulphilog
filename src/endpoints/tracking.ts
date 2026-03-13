import type { EndpointConfig } from "./base.js";
import type { CNTrackingResponse } from "../schemas/tracking.js";
import { BASE_URLS, API_CONSTANTS } from "../config.js";
import { buildQueryUrl } from "./base.js";
import { z } from "zod";
import { cnTrackingResponseSchema } from "../schemas/tracking.js";

/**
 * Request parameters for CN Tracking endpoint
 */
export interface CNTrackingRequest {
  consignment: string;
}

/**
 * CN Tracking endpoint configuration
 */
export const CNTrackingEndpoint: EndpointConfig<
  CNTrackingRequest,
  z.input<typeof cnTrackingResponseSchema>,
  CNTrackingResponse
> = {
  baseUrl: BASE_URLS.TRACKING,
  path: "/api/CNTracking",
  method: "GET",

  buildUrl: (params: CNTrackingRequest): string => {
    return buildQueryUrl(BASE_URLS.TRACKING, "/api/CNTracking", {
      consignment: params.consignment,
      id: API_CONSTANTS.TRACKING_ID,
    });
  },

  validate: (data: unknown) => data as z.input<typeof cnTrackingResponseSchema>,

  transform: (data: unknown) => cnTrackingResponseSchema.parse(data),
};
