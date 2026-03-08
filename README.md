# Mulphilog [WIP]

[![npm version](https://img.shields.io/npm/v/mulphilog.svg)](https://www.npmjs.com/package/mulphilog)
[![npm downloads](https://img.shields.io/npm/dm/mulphilog.svg)](https://www.npmjs.com/package/mulphilog)
[![license](https://img.shields.io/npm/l/mulphilog.svg)](https://github.com/hammadmajid/mulphilog/blob/main/LICENSE)

> [!CAUTION]
> This project is not sponsored, affiliated, endorsed, or approved by Mulphilog (M&P) in any way. It is an independent, open-source implementation of a client library for the Mulphilog API.

> [!WARNING]
> This library is currently a work in progress and may not be fully functional or stable. Use with caution and at your own risk. Contributions and feedback are welcome!

A thin, zero-dependency TypeScript wrapper around the Mulphilog (M&P) courier company API.

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

// Create a client instance
const client = Mulphilog({
  username: "your-username",
  password: "your-password",
  timeout: 30000, // optional, defaults to 30000ms
});

// Track a consignment
const result = await client.track({
  consignment: "54479410537894",
});

// Handle result with type-safe error handling
if (result.ok) {
  console.log("Success:", result.data.message);

  if (result.data.shipment) {
    const { shipment } = result.data;
    console.log("From:", shipment.originCity);
    console.log("To:", shipment.destinationCity);
    console.log("Status:", shipment.trackingHistory[0]?.trackingStatus);
  }
} else {
  console.error("Error:", result.error.message);
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
