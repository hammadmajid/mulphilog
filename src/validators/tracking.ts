import { ValidationError } from "../errors.js";
import type { CNTrackingResponseRaw, CNTrackingResponseItemRaw, TrackingDetailRaw, CNTrackingDetailItemRaw } from "../types/tracking.js";
import { isArray, isObject, getString, getArray } from "./utils.js";

/**
 * Validate a CN tracking detail item (individual tracking event)
 */
function validateTrackingDetailItem(data: unknown): CNTrackingDetailItemRaw {
  if (!isObject(data)) {
    throw new ValidationError("Tracking detail item must be an object");
  }

  const trackingTagID = getString(data, "TrackingTagID");
  const transactionTime = getString(data, "TransactionTime");
  const trackingStatus = getString(data, "TrackingStatus");
  const trackingNarration = getString(data, "TrackingNarration");

  if (!trackingTagID || !transactionTime || !trackingStatus || !trackingNarration) {
    throw new ValidationError("Missing required fields in tracking detail item");
  }

  return {
    TrackingTagID: trackingTagID,
    TransactionTime: transactionTime,
    Location: getString(data, "Location") ?? null,
    TrackingStatus: trackingStatus,
    TrackingNarration: trackingNarration,
    Event: getString(data, "Event") ?? null,
  };
}

/**
 * Validate a tracking detail object
 */
function validateTrackingDetail(data: unknown): TrackingDetailRaw {
  if (!isObject(data)) {
    throw new ValidationError("Tracking detail must be an object");
  }

  const consignmentNumber = getString(data, "ConsignmentNumber");
  const originCity = getString(data, "OriginCity");
  const bookingDate = getString(data, "BookingDate");
  const consigneeName = getString(data, "ConsigneeName");
  const consignerName = getString(data, "ConsignerName");
  const destinationCity = getString(data, "DestinationCity");
  const deliveryAddress = getString(data, "DeliveryAddress");

  if (!consignmentNumber || !originCity || !bookingDate || !consigneeName || !consignerName || !destinationCity || !deliveryAddress) {
    throw new ValidationError("Missing required fields in tracking detail");
  }

  // Validate tracking history
  const trackingDetailArray = getArray(data, "CNTrackingDetail");
  const cnTrackingDetail = trackingDetailArray.map(validateTrackingDetailItem);

  // CNTrackingInvDetail is currently unknown structure
  const cnTrackingInvDetail = getArray(data, "CNTrackingInvDetail");

  return {
    ConsignmentNumber: consignmentNumber,
    OrderId: getString(data, "OrderId") ?? null,
    OriginCity: originCity,
    BookingDate: bookingDate,
    CODAmount: getString(data, "CODAmount") ?? null,
    Weight: getString(data, "Weight") ?? null,
    Pieces: getString(data, "Pieces") ?? null,
    ConsigneeName: consigneeName,
    ConsignerName: consignerName,
    ContactNo: getString(data, "ContactNo") ?? null,
    DestinationCity: destinationCity,
    DeliveryAddress: deliveryAddress,
    CustomerName: getString(data, "CustomerName") ?? null,
    CustomerAccountNo: getString(data, "CustomerAccountNo") ?? null,
    HandOverDate: getString(data, "HandOverDate") ?? null,
    ServiceType: getString(data, "ServiceType") ?? null,
    DeliveryRider: getString(data, "DeliveryRider") ?? null,
    DeliveryRiderContact: getString(data, "DeliveryRiderContact") ?? null,
    SpecialInstruction: getString(data, "SpecialInstruction") ?? null,
    InvoiceNumber: getString(data, "InvoiceNumber") ?? null,
    InvoiceDate: getString(data, "InvoiceDate") ?? null,
    AmountInvoiced: getString(data, "AmountInvoiced") ?? null,
    RRNo: getString(data, "RRNo") ?? null,
    RRDate: getString(data, "RRDate") ?? null,
    RRUser: getString(data, "RRUser") ?? null,
    RRBranch: getString(data, "RRBranch") ?? null,
    PaymentID: getString(data, "PaymentID") ?? null,
    InstrumentNumber: getString(data, "InstrumentNumber") ?? null,
    PaymentDate: getString(data, "PaymentDate") ?? null,
    AmountPaid: getString(data, "AmountPaid") ?? null,
    AdjustedPaymentID: getString(data, "AdjustedPaymentID") ?? null,
    AdjustedPaymentDate: getString(data, "AdjustedPaymentDate") ?? null,
    CNTrackingDetail: cnTrackingDetail,
    CNTrackingInvDetail: cnTrackingInvDetail,
  };
}

/**
 * Validate a CN tracking response item
 */
function validateTrackingResponseItem(data: unknown): CNTrackingResponseItemRaw {
  if (!isObject(data)) {
    throw new ValidationError("Tracking response item must be an object");
  }

  const isSuccess = getString(data, "isSuccess");
  const message = getString(data, "message");
  const trackingDetailsArray = getArray(data, "tracking_Details");

  if (!isSuccess || !message) {
    throw new ValidationError("Missing required fields in tracking response item");
  }

  const tracking_Details = trackingDetailsArray.map(validateTrackingDetail);

  return {
    isSuccess,
    message,
    tracking_Details,
  };
}

/**
 * Validate the complete CN tracking API response
 * Ensures the response matches the expected structure
 * @throws ValidationError if response structure is invalid
 */
export function validateCNTrackingResponse(data: unknown): CNTrackingResponseRaw {
  if (!isArray(data)) {
    throw new ValidationError("CN Tracking response must be an array");
  }

  if (data.length === 0) {
    throw new ValidationError("CN Tracking response array is empty");
  }

  return data.map(validateTrackingResponseItem);
}
