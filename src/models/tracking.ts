import { z } from "zod";
import {
  trackingEventSchema,
  shipmentDetailsSchema,
  cnTrackingResponseSchema,
} from "../schemas/tracking.js";

/**
 * Clean, transformed models for CN Tracking
 * These types are what the client API returns to users
 * Field names stay close to API but with better organization and proper types
 */

/**
 * Individual tracking event
 */
export type TrackingEvent = z.infer<typeof trackingEventSchema>;

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
export type ShipmentDetails = z.infer<typeof shipmentDetailsSchema>;

/**
 * CN Tracking result (top-level response)
 */
export type CNTrackingResult = z.infer<typeof cnTrackingResponseSchema>;
