import type { EndpointConfig } from "./base.js";
import type { CNTrackingResponseRaw } from "../types/tracking.js";
import type { CNTrackingResult } from "../models/tracking.js";
import { BASE_URLS, API_CONSTANTS } from "../config.js";
import { buildQueryUrl } from "./base.js";
import { validateCNTrackingResponse } from "../validators/tracking.js";
import { transformCNTrackingResponse } from "../transformers/tracking.js";

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
  CNTrackingResponseRaw,
  CNTrackingResult
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

  validate: validateCNTrackingResponse,

  transform: transformCNTrackingResponse,
};
