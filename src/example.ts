/**
 * Example usage of the Mulphilog API client
 */
import { Mulphilog } from "./index.js";

// Create client
const client = Mulphilog({
  username: "demo-user",
  password: "demo-pass",
  timeout: 30000,
});

// Track a consignment
async function trackConsignment() {
  const result = await client.track({
    consignment: "560974010006747",
  });

  if (result.ok) {
    console.log("Tracking successful!");
    console.log("Success:", result.data.success);
    console.log("Message:", result.data.message);

    if (result.data.shipment) {
      const shipment = result.data.shipment;
      console.log("\nShipment Details:");
      console.log("Consignment Number:", shipment.consignmentNumber);
      console.log("Order ID:", shipment.orderID);
      console.log("Origin:", shipment.originCity);
      console.log("Destination:", shipment.destinationCity);
      console.log("Booking Date:", shipment.bookingDate.toLocaleDateString());
      console.log("Consignee:", shipment.consigneeName);
      console.log("Consigner:", shipment.consignerName);
      console.log("Address:", shipment.deliveryAddress);

      if (shipment.codAmount) {
        console.log("COD Amount:", shipment.codAmount);
      }

      console.log("\nTracking History:");
      shipment.trackingHistory.forEach((event) => {
        console.log(`[${event.transactionTime.toISOString()}] ${event.trackingStatus}`);
        console.log(`  ${event.trackingNarration}`);
      });
    }
  } else {
    console.error("Tracking failed!");
    console.error("Error:", result.error.message);
    console.error("Error type:", result.error.name);
  }
}

// Run if this file is executed directly
trackConsignment().catch(console.error);
