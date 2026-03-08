/**
 * Clean, transformed models for CN Tracking
 * These types are what the client API returns to users
 * Field names stay close to API but with better organization and proper types
 */

/**
 * Individual tracking event
 */
export interface TrackingEvent {
  trackingTagID: string;
  transactionTime: Date;
  location: string | undefined;
  trackingStatus: string;
  trackingNarration: string;
  event: string | undefined;
}

/**
 * Payment information
 */
export interface PaymentInfo {
  paymentID: string | undefined;
  instrumentNumber: string | undefined;
  paymentDate: Date | undefined;
  amountPaid: number | undefined;
  adjustedPaymentID: string | undefined;
  adjustedPaymentDate: Date | undefined;
}

/**
 * Invoice information
 */
export interface InvoiceInfo {
  invoiceNumber: string | undefined;
  invoiceDate: Date | undefined;
  amountInvoiced: number | undefined;
}

/**
 * Return receipt information
 */
export interface ReturnReceiptInfo {
  rrNo: string | undefined;
  rrDate: Date | undefined;
  rrUser: string | undefined;
  rrBranch: string | undefined;
}

/**
 * Delivery information
 */
export interface DeliveryInfo {
  handOverDate: Date | undefined;
  deliveryRider: string | undefined;
  deliveryRiderContact: string | undefined;
}

/**
 * Complete shipment details with all tracking information
 */
export interface ShipmentDetails {
  consignmentNumber: string;
  orderID: string | undefined;
  
  // Origin and destination
  originCity: string;
  destinationCity: string;
  bookingDate: Date;
  
  // Parties involved
  consigneeName: string;
  consignerName: string;
  contactNo: string | undefined;
  deliveryAddress: string;
  
  // Customer information
  customerName: string | undefined;
  customerAccountNo: string | undefined;
  
  // Shipment details
  codAmount: number | undefined;
  weight: number | undefined;
  pieces: number | undefined;
  serviceType: string | undefined;
  specialInstruction: string | undefined;
  
  // Delivery information
  delivery: DeliveryInfo;
  
  // Invoice information
  invoice: InvoiceInfo;
  
  // Return receipt information
  returnReceipt: ReturnReceiptInfo;
  
  // Payment information
  payment: PaymentInfo;
  
  // Tracking history
  trackingHistory: TrackingEvent[];
  
  // Invoice details (currently unknown structure, can be typed later)
  invoiceDetails: unknown[];
}

/**
 * CN Tracking result (top-level response)
 */
export interface CNTrackingResult {
  success: boolean;
  message: string;
  shipment: ShipmentDetails | undefined;
}
