import { z } from "zod";

export const bookingResponseSchema = z
  .array(
    z.object({
      isSuccess: z.string(),
      message: z.string(),
      orderReferenceId: z.string(),
    }),
  )
  .min(1)
  .transform((arr) => {
    // Safe to assert: .min(1) guarantees at least one element
    const first = arr[0];
    if (!first) {
      throw new Error("Array is empty despite min(1) validation");
    }
    return first;
  });

export type BookingResponse = z.infer<typeof bookingResponseSchema>;
