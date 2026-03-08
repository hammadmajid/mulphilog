import { z } from "zod";

/**
 * Helper transformers for common data conversions
 */

// Transform nullable string to number or undefined
const stringToNumber = z
  .string()
  .nullable()
  .transform((val) => {
    if (!val || val === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });

// Transform string to Date with validation
const stringToDate = z.string().transform((val, ctx) => {
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid date format: "${val}"`,
    });
    return z.NEVER;
  }
  return date;
});

// Transform "true"/"false" string to boolean
const stringToBoolean = z.string().transform((val) => val === "true");

// Transform nullable string to string or undefined
const nullableString = z
  .string()
  .nullable()
  .transform((val) => val ?? undefined);

/**
 * Tracking Event Schema
 * Validates and transforms individual tracking events
 */
export const trackingEventSchema = z
  .object({
    TrackingTagID: z.string(),
    TransactionTime: z.string(),
    Location: z.string().nullable(),
    TrackingStatus: z.string(),
    TrackingNarration: z.string(),
    Event: z.string().nullable(),
  })
  .transform((data) => ({
    trackingTagID: data.TrackingTagID,
    transactionTime: new Date(data.TransactionTime),
    location: data.Location ?? undefined,
    trackingStatus: data.TrackingStatus,
    trackingNarration: data.TrackingNarration,
    event: data.Event ?? undefined,
  }));

/**
 * Tracking Detail Schema
 * Validates and transforms complete shipment tracking details
 */
export const shipmentDetailsSchema = z
  .object({
    ConsignmentNumber: z.string(),
    OrderId: nullableString,
    OriginCity: z.string(),
    BookingDate: stringToDate,
    CODAmount: stringToNumber,
    Weight: stringToNumber,
    Pieces: stringToNumber,
    ConsigneeName: z.string(),
    ConsignerName: z.string(),
    ContactNo: nullableString,
    DestinationCity: z.string(),
    DeliveryAddress: z.string(),
    CustomerName: nullableString,
    CustomerAccountNo: nullableString,
    HandOverDate: z.string().nullable(),
    ServiceType: nullableString,
    DeliveryRider: z.string().nullable(),
    DeliveryRiderContact: z.string().nullable(),
    SpecialInstruction: nullableString,
    InvoiceNumber: z.string().nullable(),
    InvoiceDate: z.string().nullable(),
    AmountInvoiced: z.string().nullable(),
    RRNo: z.string().nullable(),
    RRDate: z.string().nullable(),
    RRUser: z.string().nullable(),
    RRBranch: z.string().nullable(),
    PaymentID: z.string().nullable(),
    InstrumentNumber: z.string().nullable(),
    PaymentDate: z.string().nullable(),
    AmountPaid: z.string().nullable(),
    AdjustedPaymentID: z.string().nullable(),
    AdjustedPaymentDate: z.string().nullable(),
    CNTrackingDetail: z.array(trackingEventSchema),
    CNTrackingInvDetail: z.array(z.unknown()),
  })
  .transform((data) => ({
    consignmentNumber: data.ConsignmentNumber,
    orderID: data.OrderId,
    originCity: data.OriginCity,
    destinationCity: data.DestinationCity,
    bookingDate: data.BookingDate,
    consigneeName: data.ConsigneeName,
    consignerName: data.ConsignerName,
    contactNo: data.ContactNo,
    deliveryAddress: data.DeliveryAddress,
    customerName: data.CustomerName,
    customerAccountNo: data.CustomerAccountNo,
    codAmount: data.CODAmount,
    weight: data.Weight,
    pieces: data.Pieces,
    serviceType: data.ServiceType,
    specialInstruction: data.SpecialInstruction,
    delivery: {
      handOverDate: data.HandOverDate
        ? (() => {
            const date = new Date(data.HandOverDate);
            return isNaN(date.getTime()) ? undefined : date;
          })()
        : undefined,
      deliveryRider: data.DeliveryRider ?? undefined,
      deliveryRiderContact: data.DeliveryRiderContact ?? undefined,
    },
    invoice: {
      invoiceNumber: data.InvoiceNumber ?? undefined,
      invoiceDate: data.InvoiceDate
        ? (() => {
            const date = new Date(data.InvoiceDate);
            return isNaN(date.getTime()) ? undefined : date;
          })()
        : undefined,
      amountInvoiced:
        data.AmountInvoiced && data.AmountInvoiced !== "" ? Number(data.AmountInvoiced) : undefined,
    },
    returnReceipt: {
      rrNo: data.RRNo ?? undefined,
      rrDate: data.RRDate
        ? (() => {
            const date = new Date(data.RRDate);
            return isNaN(date.getTime()) ? undefined : date;
          })()
        : undefined,
      rrUser: data.RRUser ?? undefined,
      rrBranch: data.RRBranch ?? undefined,
    },
    payment: {
      paymentID: data.PaymentID ?? undefined,
      instrumentNumber: data.InstrumentNumber ?? undefined,
      paymentDate: data.PaymentDate
        ? (() => {
            const date = new Date(data.PaymentDate);
            return isNaN(date.getTime()) ? undefined : date;
          })()
        : undefined,
      amountPaid: data.AmountPaid && data.AmountPaid !== "" ? Number(data.AmountPaid) : undefined,
      adjustedPaymentID: data.AdjustedPaymentID ?? undefined,
      adjustedPaymentDate: data.AdjustedPaymentDate
        ? (() => {
            const date = new Date(data.AdjustedPaymentDate);
            return isNaN(date.getTime()) ? undefined : date;
          })()
        : undefined,
    },
    trackingHistory: data.CNTrackingDetail,
    invoiceDetails: data.CNTrackingInvDetail,
  }));

/**
 * CN Tracking Response Item Schema
 */
const cnTrackingResponseItemSchema = z
  .object({
    isSuccess: stringToBoolean,
    message: z.string(),
    tracking_Details: z.array(shipmentDetailsSchema),
  })
  .transform((data) => ({
    success: data.isSuccess,
    message: data.message,
    trackingDetails: data.tracking_Details,
  }));

/**
 * Complete CN Tracking Response Schema
 * Validates and transforms the entire API response
 */
export const cnTrackingResponseSchema = z
  .array(cnTrackingResponseItemSchema)
  .min(1, "CN Tracking response array cannot be empty")
  .transform((data) => {
    const item = data[0];
    if (!item) {
      return {
        success: false,
        message: "Empty response from API",
        shipment: undefined,
      };
    }

    const trackingDetail = item.trackingDetails[0];

    return {
      success: item.success,
      message: item.message,
      shipment: trackingDetail ?? undefined,
    };
  });

/**
 * Inferred TypeScript types from Zod schemas
 */
export type CNTrackingResponse = z.infer<typeof cnTrackingResponseSchema>;
