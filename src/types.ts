/**
 * Configuration options for initializing the Mulphilog API client
 */
export interface MulphilogOptions {
  /**
   * API key for authentication with Mulphilog API
   */
  apiKey?: string;

  /**
   * Base URL for the Mulphilog API
   * @default "https://api.mulphilog.com"
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Tracking information response
 */
export interface TrackingInfo {
  trackingId: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  history?: TrackingEvent[];
}

/**
 * Individual tracking event in shipment history
 */
export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description?: string;
}

/**
 * Options for creating a new order
 */
export interface CreateOrderOptions {
  /**
   * Sender information
   */
  sender: ContactInfo;

  /**
   * Recipient information
   */
  recipient: ContactInfo;

  /**
   * Package details
   */
  package: PackageInfo;

  /**
   * Service type (e.g., "standard", "express", "overnight")
   */
  serviceType?: string;

  /**
   * Additional instructions or notes
   */
  notes?: string;
}

/**
 * Contact information for sender or recipient
 */
export interface ContactInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

/**
 * Package information
 */
export interface PackageInfo {
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  value?: number;
}

/**
 * Response from creating an order
 */
export interface CreateOrderResponse {
  orderId: string;
  trackingId: string;
  status: string;
  estimatedDelivery?: string;
  cost?: number;
}

/**
 * Mulphilog API client instance
 */
export interface MulphilogClient {
  /**
   * Track a shipment by tracking ID
   * @param trackingId - The tracking ID to look up
   */
  track(trackingId: string): Promise<TrackingInfo>;

  /**
   * Create a new shipping order
   * @param options - Order creation options
   */
  createOrder(options: CreateOrderOptions): Promise<CreateOrderResponse>;
}
