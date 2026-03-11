import { z } from "zod";

/**
 * Schema for individual location/city result
 * Since the swagger doesn't specify the fields, we use a flexible object
 * but include common expected fields like LocationID, LocationName, CityName.
 */
export const locationSchema = z.record(z.string(), z.any());

/**
 * Response schema for Get_locations and Get_Cities
 * Typically returns an array of objects wrapped in another array (API quirk)
 */
export const getLocationsResponseSchema = z
  .array(
    z
      .object({
        isSuccess: z.string(),
        message: z.string(),
        // The API often puts data in a field like 'Locations', 'Cities' or 'Data'
        // Since it's not specified, we'll allow any additional fields
      })
      .passthrough(),
  )
  .min(1)
  .transform((arr) => {
    const first = arr[0];
    if (!first) {
      throw new Error("Array is empty despite min(1) validation");
    }
    return first;
  });

/**
 * Response schema for AddLocation
 * Similar to booking response, returns success status and message
 */
export const addLocationResponseSchema = z
  .array(
    z
      .object({
        isSuccess: z.string(),
        message: z.string(),
      })
      .passthrough(),
  )
  .min(1)
  .transform((arr) => {
    const first = arr[0];
    if (!first) {
      throw new Error("Array is empty despite min(1) validation");
    }
    return first;
  });

export type GetLocationsResponse = z.infer<typeof getLocationsResponseSchema>;
export type AddLocationResponse = z.infer<typeof addLocationResponseSchema>;
export type Location = z.infer<typeof locationSchema>;
