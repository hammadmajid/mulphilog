# Mulphilog [WIP]

[![npm version](https://img.shields.io/npm/v/mulphilog.svg)](https://www.npmjs.com/package/mulphilog)
[![npm downloads](https://img.shields.io/npm/dm/mulphilog.svg)](https://www.npmjs.com/package/mulphilog)
[![license](https://img.shields.io/npm/l/mulphilog.svg)](https://github.com/hammadmajid/mulphilog/blob/main/LICENSE)

> [!CAUTION]
> This project is not sponsored, affiliated, endorsed, or approved by Mulphilog (M&P) in any way. It is an independent, open-source implementation of a client library for the Mulphilog API.

> [!WARNING]
> This library is currently a work in progress and may not be fully functional or stable. Use with caution and at your own risk. Contributions and feedback are welcome!

A thin, TypeScript wrapper around the Mulphilog (M&P) courier company API with runtime validation powered by Zod.

## Installation

### npm

```bash
npm install mulphilog
```

```bash
pnpm add mulphilog
```

```bash
yarn add mulphilog
```

### JSR

```bash
npx jsr add @bine/mulphilog
```

```bash
deno add @bine/mulphilog
```

## Quick Start

```typescript
import { Mulphilog } from "mulphilog";

// Create a client instance with M&P provided credentials
const client = Mulphilog({
  // Authentication credentials (provided by M&P)
  username: "your-username",
  password: "your-password",

  // Account configuration (provided by M&P)
  accountNo: "4T154", // Parent account number
  locationID: "41", // Location ID (sub-account)
  insertType: 19, // Insert type
  returnLocation: 41, // Return location ID
  subAccountId: 2, // Sub-account ID

  // Optional settings
  timeout: 30000, // Request timeout (defaults to 30000ms)
});

// Track a consignment
const trackResult = await client.track({
  consignment: "54479410537894",
});

// Handle result with type-safe error handling
if (trackResult.ok) {
  console.log("Success:", trackResult.data.message);

  if (trackResult.data.shipment) {
    const { shipment } = trackResult.data;
    console.log("From:", shipment.originCity);
    console.log("To:", shipment.destinationCity);
    console.log("Status:", shipment.trackingHistory[0]?.trackingStatus);
  }
} else {
  console.error("Error:", trackResult.error.message);
}

// Create a booking/shipment
// Note: M&P credentials are automatically injected from client config
const bookingResult = await client.booking({
  consigneeName: "John Doe",
  consigneeAddress: "123 Main Street, Islamabad",
  consigneeMobNo: "03001234567",
  consigneeEmail: "john@example.com",
  destinationCityName: "karachi",
  pieces: 1,
  weight: 2.5,
  codAmount: 5000,
  custRefNo: "ORDER-12345",
  productDetails: "Electronics",
  fragile: "YES",
  service: "Overnight",
  remarks: "Handle with care",
  insuranceValue: "1000",
});

// Handle booking result
if (bookingResult.ok) {
  console.log("Booking successful!");
  console.log("Order Reference:", bookingResult.data.orderReferenceId);
  console.log("Message:", bookingResult.data.message);
} else {
  console.error("Booking failed:", bookingResult.error.message);
}

// Get list of locations
const locationsResult = await client.getLocations();
if (locationsResult.ok) {
  console.log("Locations found:", locationsResult.data.length);
  locationsResult.data.forEach((loc) => {
    console.log(`${loc.locationName} (${loc.locationID})`);
  });
}

// Get list of cities
const citiesResult = await client.getCities();
if (citiesResult.ok) {
  console.log("Cities found:", citiesResult.data.length);
}

// Add a new location
const addLocationResult = await client.addLocation({
  branchCode: 1,
  locationName: "New Warehouse",
  locationAddress: "Plot 123, Industrial Area, Karachi",
  to: ["manager@example.com"],
  cc: ["admin@example.com"],
});

if (addLocationResult.ok) {
  console.log("Location added successfully:", addLocationResult.data.message);
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
