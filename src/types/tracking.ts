/**
 * Raw API response types for CN Tracking endpoint
 * These types match the exact structure returned by the Mulphilog API
 */

/**
 * Individual tracking event detail (raw API format)
 */
export interface CNTrackingDetailItemRaw {
  TrackingTagID: string;
  TransactionTime: string;
  Location: string | null;
  TrackingStatus: string;
  TrackingNarration: string;
  Event: string | null;
}

/**
 * Tracking detail for a consignment (raw API format)
 * Contains all shipment information and tracking history
 */
export interface TrackingDetailRaw {
  ConsignmentNumber: string;
  OrderId: string | null;
  OriginCity: string;
  BookingDate: string;
  CODAmount: string | null;
  Weight: string | null;
  Pieces: string | null;
  ConsigneeName: string;
  ConsignerName: string;
  ContactNo: string | null;
  DestinationCity: string;
  DeliveryAddress: string;
  CustomerName: string | null;
  CustomerAccountNo: string | null;
  HandOverDate: string | null;
  ServiceType: string | null;
  DeliveryRider: string | null;
  DeliveryRiderContact: string | null;
  SpecialInstruction: string | null;
  InvoiceNumber: string | null;
  InvoiceDate: string | null;
  AmountInvoiced: string | null;
  RRNo: string | null;
  RRDate: string | null;
  RRUser: string | null;
  RRBranch: string | null;
  PaymentID: string | null;
  InstrumentNumber: string | null;
  PaymentDate: string | null;
  AmountPaid: string | null;
  AdjustedPaymentID: string | null;
  AdjustedPaymentDate: string | null;
  CNTrackingDetail: CNTrackingDetailItemRaw[];
  CNTrackingInvDetail: unknown[];
}

/**
 * Top-level tracking response item (raw API format)
 */
export interface CNTrackingResponseItemRaw {
  isSuccess: string;
  message: string;
  tracking_Details: TrackingDetailRaw[];
}

/**
 * Complete CN Tracking API response (raw format)
 * The API returns an array with a single item
 */
export type CNTrackingResponseRaw = CNTrackingResponseItemRaw[];
