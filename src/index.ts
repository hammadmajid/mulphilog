import type {
  MulphilogOptions,
  MulphilogClient,
  TrackingInfo,
  CreateOrderOptions,
  CreateOrderResponse,
} from "./types.js";

/**
 * Default configuration values
 */
const DEFAULT_OPTIONS: Required<MulphilogOptions> = {
  apiKey: "",
  baseUrl: "https://api.mulphilog.com",
  timeout: 30000,
};

/**
 * Creates a Mulphilog API client instance
 *
 * @param options - Configuration options for the client
 * @returns Mulphilog API client instance
 *
 * @example
 * ```typescript
 * const mp = Mulphilog({
 *   apiKey: "your-api-key",
 *   baseUrl: "https://api.mulphilog.com"
 * });
 *
 * // Track a shipment
 * const tracking = await mp.track("MP123456789");
 *
 * // Create an order
 * const order = await mp.createOrder({
 *   sender: { ... },
 *   recipient: { ... },
 *   package: { ... }
 * });
 * ```
 */
export function Mulphilog(options: MulphilogOptions = {}): MulphilogClient {
  const config = { ...DEFAULT_OPTIONS, ...options };

  /**
   * Make an HTTP request to the Mulphilog API
   */
  async function request<T>(endpoint: string, method: string = "GET", body?: unknown): Promise<T> {
    const url = `${config.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const init: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body) {
        init.body = JSON.stringify(body);
      }

      const response = await fetch(url, init);

      if (!response.ok) {
        throw new Error(`Mulphilog API error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${config.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    /**
     * Track a shipment by tracking ID
     */
    async track(trackingId: string): Promise<TrackingInfo> {
      if (!trackingId || typeof trackingId !== "string") {
        throw new Error("Tracking ID must be a non-empty string");
      }

      return request<TrackingInfo>(`/track/${encodeURIComponent(trackingId)}`);
    },

    /**
     * Create a new shipping order
     */
    async createOrder(orderOptions: CreateOrderOptions): Promise<CreateOrderResponse> {
      if (!orderOptions || typeof orderOptions !== "object") {
        throw new Error("Order options must be provided");
      }

      return request<CreateOrderResponse>("/orders", "POST", orderOptions);
    },
  };
}

// Default export for convenience
export default Mulphilog;
