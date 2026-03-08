import type {
  CNTrackingResponseRaw,
  TrackingDetailRaw,
  CNTrackingDetailItemRaw,
} from "../types/tracking.js";
import type {
  CNTrackingResult,
  ShipmentDetails,
  TrackingEvent,
  PaymentInfo,
  InvoiceInfo,
  ReturnReceiptInfo,
  DeliveryInfo,
} from "../models/tracking.js";
import { parseNumber, parseDate, parseDateTime, parseBoolean } from "../validators/utils.js";

/**
 * Transform a tracking detail item to a tracking event
 */
function transformTrackingEvent(raw: CNTrackingDetailItemRaw): TrackingEvent {
  return {
    trackingTagID: raw.TrackingTagID,
    transactionTime: parseDateTime(raw.TransactionTime),
    location: raw.Location ?? undefined,
    trackingStatus: raw.TrackingStatus,
    trackingNarration: raw.TrackingNarration,
    event: raw.Event ?? undefined,
  };
}

/**
 * Transform payment information
 */
function transformPaymentInfo(raw: TrackingDetailRaw): PaymentInfo {
  return {
    paymentID: raw.PaymentID ?? undefined,
    instrumentNumber: raw.InstrumentNumber ?? undefined,
    paymentDate: raw.PaymentDate ? parseDate(raw.PaymentDate) : undefined,
    amountPaid: parseNumber(raw.AmountPaid),
    adjustedPaymentID: raw.AdjustedPaymentID ?? undefined,
    adjustedPaymentDate: raw.AdjustedPaymentDate ? parseDate(raw.AdjustedPaymentDate) : undefined,
  };
}

/**
 * Transform invoice information
 */
function transformInvoiceInfo(raw: TrackingDetailRaw): InvoiceInfo {
  return {
    invoiceNumber: raw.InvoiceNumber ?? undefined,
    invoiceDate: raw.InvoiceDate ? parseDate(raw.InvoiceDate) : undefined,
    amountInvoiced: parseNumber(raw.AmountInvoiced),
  };
}

/**
 * Transform return receipt information
 */
function transformReturnReceiptInfo(raw: TrackingDetailRaw): ReturnReceiptInfo {
  return {
    rrNo: raw.RRNo ?? undefined,
    rrDate: raw.RRDate ? parseDate(raw.RRDate) : undefined,
    rrUser: raw.RRUser ?? undefined,
    rrBranch: raw.RRBranch ?? undefined,
  };
}

/**
 * Transform delivery information
 */
function transformDeliveryInfo(raw: TrackingDetailRaw): DeliveryInfo {
  return {
    handOverDate: raw.HandOverDate ? parseDate(raw.HandOverDate) : undefined,
    deliveryRider: raw.DeliveryRider ?? undefined,
    deliveryRiderContact: raw.DeliveryRiderContact ?? undefined,
  };
}

/**
 * Transform a tracking detail to shipment details
 */
function transformShipmentDetails(raw: TrackingDetailRaw): ShipmentDetails {
  return {
    consignmentNumber: raw.ConsignmentNumber,
    orderID: raw.OrderId ?? undefined,

    // Origin and destination
    originCity: raw.OriginCity,
    destinationCity: raw.DestinationCity,
    bookingDate: parseDate(raw.BookingDate),

    // Parties involved
    consigneeName: raw.ConsigneeName,
    consignerName: raw.ConsignerName,
    contactNo: raw.ContactNo ?? undefined,
    deliveryAddress: raw.DeliveryAddress,

    // Customer information
    customerName: raw.CustomerName ?? undefined,
    customerAccountNo: raw.CustomerAccountNo ?? undefined,

    // Shipment details
    codAmount: parseNumber(raw.CODAmount),
    weight: parseNumber(raw.Weight),
    pieces: parseNumber(raw.Pieces),
    serviceType: raw.ServiceType ?? undefined,
    specialInstruction: raw.SpecialInstruction ?? undefined,

    // Nested information
    delivery: transformDeliveryInfo(raw),
    invoice: transformInvoiceInfo(raw),
    returnReceipt: transformReturnReceiptInfo(raw),
    payment: transformPaymentInfo(raw),

    // Tracking history
    trackingHistory: raw.CNTrackingDetail.map(transformTrackingEvent),

    // Invoice details
    invoiceDetails: raw.CNTrackingInvDetail,
  };
}

/**
 * Transform raw CN tracking response to clean result
 */
export function transformCNTrackingResponse(raw: CNTrackingResponseRaw): CNTrackingResult {
  // API returns array with single item
  const item = raw[0];

  if (!item) {
    return {
      success: false,
      message: "Empty response from API",
      shipment: undefined,
    };
  }

  const success = parseBoolean(item.isSuccess);

  // Get first tracking detail (usually only one per consignment)
  const trackingDetail = item.tracking_Details[0];

  return {
    success,
    message: item.message,
    shipment: trackingDetail ? transformShipmentDetails(trackingDetail) : undefined,
  };
}
