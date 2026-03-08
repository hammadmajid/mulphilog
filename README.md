# Mulphilog

A thin, zero-dependency TypeScript wrapper around the Mulphilog (M&P) courier company API.

## Installation

```bash
npm install mulphilog
```

```bash
pnpm add mulphilog
```

```bash
yarn add mulphilog
```

## Quick Start

```typescript
import Mulphilog from "mulphilog";

// Initialize the client
const mp = Mulphilog({
  apiKey: "your-api-key",
  baseUrl: "https://api.mulphilog.com", // optional
  timeout: 30000, // optional, in milliseconds
});

// Track a shipment
const tracking = await mp.track("MP123456789");
console.log(tracking.status);

// Create a new order
const order = await mp.createOrder({
  sender: {
    name: "John Doe",
    address: "123 Main St",
    city: "New York",
    postalCode: "10001",
    country: "US",
    email: "john@example.com",
  },
  recipient: {
    name: "Jane Smith",
    address: "456 Oak Ave",
    city: "Los Angeles",
    postalCode: "90001",
    country: "US",
    phone: "+1234567890",
  },
  package: {
    weight: 2.5, // kg
    dimensions: {
      length: 30,
      width: 20,
      height: 10,
    },
    description: "Books",
    value: 50.0,
  },
  serviceType: "express", // optional: "standard", "express", "overnight"
  notes: "Handle with care",
});

console.log(`Order created: ${order.orderId}`);
console.log(`Tracking ID: ${order.trackingId}`);
```

## API Reference

### `Mulphilog(options)`

Creates a new Mulphilog API client instance.

#### Options

| Option     | Type     | Required | Default                       | Description                       |
| ---------- | -------- | -------- | ----------------------------- | --------------------------------- |
| `apiKey`   | `string` | No       | `""`                          | API key for authentication        |
| `baseUrl`  | `string` | No       | `"https://api.mulphilog.com"` | Base URL for the Mulphilog API    |
| `timeout`  | `number` | No       | `30000`                       | Request timeout in milliseconds   |

### Methods

#### `mp.track(trackingId)`

Track a shipment by tracking ID.

**Parameters:**
- `trackingId` (string): The tracking ID to look up

**Returns:** `Promise<TrackingInfo>`

```typescript
interface TrackingInfo {
  trackingId: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  history?: TrackingEvent[];
}
```

**Example:**

```typescript
const tracking = await mp.track("MP123456789");
console.log(tracking.status);
console.log(tracking.currentLocation);
```

#### `mp.createOrder(options)`

Create a new shipping order.

**Parameters:**
- `options` (CreateOrderOptions): Order creation options

**Returns:** `Promise<CreateOrderResponse>`

```typescript
interface CreateOrderOptions {
  sender: ContactInfo;
  recipient: ContactInfo;
  package: PackageInfo;
  serviceType?: string;
  notes?: string;
}

interface CreateOrderResponse {
  orderId: string;
  trackingId: string;
  status: string;
  estimatedDelivery?: string;
  cost?: number;
}
```

**Example:**

```typescript
const order = await mp.createOrder({
  sender: { /* ... */ },
  recipient: { /* ... */ },
  package: {
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 10 },
    description: "Books",
  },
});
```

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All types are exported from the main module:

```typescript
import Mulphilog, {
  type MulphilogOptions,
  type MulphilogClient,
  type TrackingInfo,
  type CreateOrderOptions,
  type CreateOrderResponse,
  type ContactInfo,
  type PackageInfo,
} from "mulphilog";
```

## Error Handling

The library throws errors for:
- Invalid parameters (e.g., missing tracking ID)
- API errors (non-200 responses)
- Request timeouts

```typescript
try {
  const tracking = await mp.track("INVALID_ID");
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

## Module Support

This is a modern ESM-only package.

```javascript
import Mulphilog from "mulphilog";
```

## Requirements

- Node.js 20.0.0 or higher
- ESM support (type: "module" in package.json)

## License

MIT
