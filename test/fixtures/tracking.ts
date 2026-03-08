/**
 * Test fixtures for tracking API responses
 */

/**
 * Valid successful tracking response with complete data
 */
export const validTrackingResponseComplete = [
  {
    isSuccess: "true",
    message: "Consignment tracking details retrieved successfully",
    tracking_Details: [
      {
        ConsignmentNumber: "54479410537894",
        OrderId: "ORD-12345",
        OriginCity: "Karachi",
        BookingDate: "20 Feb 2025",
        CODAmount: "5000",
        Weight: "2.5",
        Pieces: "3",
        ConsigneeName: "John Doe",
        ConsignerName: "Jane Smith",
        ContactNo: "+92-300-1234567",
        DestinationCity: "Lahore",
        DeliveryAddress: "123 Main Street, Gulberg",
        CustomerName: "ABC Company",
        CustomerAccountNo: "ACC-001",
        HandOverDate: "22 Feb 2025",
        ServiceType: "Express",
        DeliveryRider: "Ali Khan",
        DeliveryRiderContact: "+92-301-7654321",
        SpecialInstruction: "Handle with care",
        InvoiceNumber: "INV-2025-001",
        InvoiceDate: "20 Feb 2025",
        AmountInvoiced: "500",
        RRNo: "RR-001",
        RRDate: "22 Feb 2025",
        RRUser: "admin",
        RRBranch: "Lahore Main",
        PaymentID: "PAY-001",
        InstrumentNumber: "CHQ-12345",
        PaymentDate: "23 Feb 2025",
        AmountPaid: "5500",
        AdjustedPaymentID: "APAY-001",
        AdjustedPaymentDate: "24 Feb 2025",
        CNTrackingDetail: [
          {
            TrackingTagID: "TRK-001",
            TransactionTime: "02/20/2025 10:30:00",
            Location: "Karachi Hub",
            TrackingStatus: "Booked",
            TrackingNarration: "Shipment booked successfully",
            Event: "BOOKING",
          },
          {
            TrackingTagID: "TRK-002",
            TransactionTime: "02/21/2025 08:15:00",
            Location: "Lahore Hub",
            TrackingStatus: "In Transit",
            TrackingNarration: "Shipment in transit to destination",
            Event: "IN_TRANSIT",
          },
          {
            TrackingTagID: "TRK-003",
            TransactionTime: "02/22/2025 14:45:00",
            Location: "Lahore Delivery Station",
            TrackingStatus: "Delivered",
            TrackingNarration: "Shipment delivered successfully",
            Event: "DELIVERED",
          },
        ],
        CNTrackingInvDetail: [],
      },
    ],
  },
];

/**
 * Valid tracking response with minimal data (only required fields)
 */
export const validTrackingResponseMinimal = [
  {
    isSuccess: "true",
    message: "Consignment found",
    tracking_Details: [
      {
        ConsignmentNumber: "12345678901234",
        OrderId: null,
        OriginCity: "Islamabad",
        BookingDate: "15 Mar 2025",
        CODAmount: null,
        Weight: null,
        Pieces: null,
        ConsigneeName: "Test User",
        ConsignerName: "Test Sender",
        ContactNo: null,
        DestinationCity: "Rawalpindi",
        DeliveryAddress: "Test Address",
        CustomerName: null,
        CustomerAccountNo: null,
        HandOverDate: null,
        ServiceType: null,
        DeliveryRider: null,
        DeliveryRiderContact: null,
        SpecialInstruction: null,
        InvoiceNumber: null,
        InvoiceDate: null,
        AmountInvoiced: null,
        RRNo: null,
        RRDate: null,
        RRUser: null,
        RRBranch: null,
        PaymentID: null,
        InstrumentNumber: null,
        PaymentDate: null,
        AmountPaid: null,
        AdjustedPaymentID: null,
        AdjustedPaymentDate: null,
        CNTrackingDetail: [
          {
            TrackingTagID: "TRK-MINIMAL",
            TransactionTime: "03/15/2025 09:00:00",
            Location: null,
            TrackingStatus: "Booked",
            TrackingNarration: "Shipment booked",
            Event: null,
          },
        ],
        CNTrackingInvDetail: [],
      },
    ],
  },
];

/**
 * Response when consignment is not found
 */
export const notFoundTrackingResponse = [
  {
    isSuccess: "false",
    message: "Consignment not found",
    tracking_Details: [],
  },
];

/**
 * Invalid response - not an array
 */
export const invalidResponseNotArray = {
  isSuccess: "true",
  message: "Invalid format",
};

/**
 * Invalid response - empty array
 */
export const invalidResponseEmptyArray: unknown[] = [];

/**
 * Invalid response - missing required fields in response item
 */
export const invalidResponseMissingFields = [
  {
    isSuccess: "true",
    // missing 'message' field
    tracking_Details: [],
  },
];

/**
 * Invalid response - missing required fields in tracking detail
 */
export const invalidResponseMissingTrackingFields = [
  {
    isSuccess: "true",
    message: "Success",
    tracking_Details: [
      {
        ConsignmentNumber: "12345678901234",
        // missing required fields like OriginCity, BookingDate, etc.
        CNTrackingDetail: [],
        CNTrackingInvDetail: [],
      },
    ],
  },
];

/**
 * Invalid response - wrong field types
 */
export const invalidResponseWrongTypes = [
  {
    isSuccess: "true",
    message: "Success",
    tracking_Details: "not-an-array", // should be array
  },
];

/**
 * Invalid response - missing required fields in tracking event
 */
export const invalidResponseMissingEventFields = [
  {
    isSuccess: "true",
    message: "Success",
    tracking_Details: [
      {
        ConsignmentNumber: "12345678901234",
        OrderId: null,
        OriginCity: "Karachi",
        BookingDate: "20 Feb 2025",
        CODAmount: null,
        Weight: null,
        Pieces: null,
        ConsigneeName: "Test User",
        ConsignerName: "Test Sender",
        ContactNo: null,
        DestinationCity: "Lahore",
        DeliveryAddress: "Test Address",
        CustomerName: null,
        CustomerAccountNo: null,
        HandOverDate: null,
        ServiceType: null,
        DeliveryRider: null,
        DeliveryRiderContact: null,
        SpecialInstruction: null,
        InvoiceNumber: null,
        InvoiceDate: null,
        AmountInvoiced: null,
        RRNo: null,
        RRDate: null,
        RRUser: null,
        RRBranch: null,
        PaymentID: null,
        InstrumentNumber: null,
        PaymentDate: null,
        AmountPaid: null,
        AdjustedPaymentID: null,
        AdjustedPaymentDate: null,
        CNTrackingDetail: [
          {
            TrackingTagID: "TRK-001",
            // missing TransactionTime, TrackingStatus, TrackingNarration
            Location: null,
            Event: null,
          },
        ],
        CNTrackingInvDetail: [],
      },
    ],
  },
];

/**
 * Response with invalid date formats
 */
export const invalidDateFormatsResponse = [
  {
    isSuccess: "true",
    message: "Success",
    tracking_Details: [
      {
        ConsignmentNumber: "12345678901234",
        OrderId: null,
        OriginCity: "Karachi",
        BookingDate: "invalid-date",
        CODAmount: null,
        Weight: null,
        Pieces: null,
        ConsigneeName: "Test User",
        ConsignerName: "Test Sender",
        ContactNo: null,
        DestinationCity: "Lahore",
        DeliveryAddress: "Test Address",
        CustomerName: null,
        CustomerAccountNo: null,
        HandOverDate: null,
        ServiceType: null,
        DeliveryRider: null,
        DeliveryRiderContact: null,
        SpecialInstruction: null,
        InvoiceNumber: null,
        InvoiceDate: null,
        AmountInvoiced: null,
        RRNo: null,
        RRDate: null,
        RRUser: null,
        RRBranch: null,
        PaymentID: null,
        InstrumentNumber: null,
        PaymentDate: null,
        AmountPaid: null,
        AdjustedPaymentID: null,
        AdjustedPaymentDate: null,
        CNTrackingDetail: [
          {
            TrackingTagID: "TRK-001",
            TransactionTime: "not-a-datetime",
            Location: null,
            TrackingStatus: "Booked",
            TrackingNarration: "Test",
            Event: null,
          },
        ],
        CNTrackingInvDetail: [],
      },
    ],
  },
];
