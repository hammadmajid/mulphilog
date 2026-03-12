/**
 * Test fixtures for booking API requests and responses
 */

import type { BookingRequest } from "../../src/endpoints/booking.js";

/**
 * Valid booking request with all required fields
 */
export const validBookingRequest: BookingRequest = {
  username: "test_user",
  password: "12345",
  consigneeName: "Aleeza Moazzam",
  consigneeAddress: "DHA KHI",
  consigneeMobNo: "03134568904",
  consigneeEmail: "aleeza@mulphilog.com",
  destinationCityName: "islamabad",
  pieces: 1,
  weight: 1,
  codAmount: 1,
  custRefNo: "test_1234",
  productDetails: "New Mobile",
  fragile: "YES",
  service: "Overnight",
  remarks: "Call Before Delivery",
  insuranceValue: "0",
  locationID: "41",
  AccountNo: "4T154",
  InsertType: 19,
  ReturnLocation: 41,
  subAccountId: 2,
};

/**
 * Valid booking request for Second Day service
 */
export const validBookingRequestSecondDay: BookingRequest = {
  username: "test_user",
  password: "12345",
  consigneeName: "John Doe",
  consigneeAddress: "F-10 Islamabad",
  consigneeMobNo: "03001234567",
  consigneeEmail: "john@example.com",
  destinationCityName: "karachi",
  pieces: 2,
  weight: 3.5,
  codAmount: 5000,
  custRefNo: "ORDER-5678",
  productDetails: "Electronics",
  fragile: "YES",
  service: "Second Day",
  remarks: "Fragile - Handle with care",
  insuranceValue: "1000",
  locationID: "41",
  AccountNo: "4T154",
  InsertType: 19,
  ReturnLocation: 41,
  subAccountId: 2,
};

/**
 * Valid booking request with non-fragile item
 */
export const validBookingRequestNonFragile: BookingRequest = {
  username: "test_user",
  password: "12345",
  consigneeName: "Sarah Ahmed",
  consigneeAddress: "Gulberg, Lahore",
  consigneeMobNo: "03219876543",
  consigneeEmail: "sarah@example.com",
  destinationCityName: "lahore",
  pieces: 1,
  weight: 0.5,
  codAmount: 2500,
  custRefNo: "REF-9999",
  productDetails: "Documents",
  fragile: "NO",
  service: "Overnight",
  remarks: "Office delivery only",
  insuranceValue: "0",
  locationID: "41",
  AccountNo: "4T154",
  InsertType: 19,
  ReturnLocation: 41,
  subAccountId: 2,
};

/**
 * Valid successful booking response
 */
export const validBookingResponse = [
  {
    isSuccess: "true",
    message: "Order saved successfully!",
    orderReferenceId: "544794010101495",
  },
];

/**
 * Successful booking response with different order ID
 */
export const validBookingResponse2 = [
  {
    isSuccess: "true",
    message: "Order saved successfully!",
    orderReferenceId: "544794010101496",
  },
];

/**
 * Failed booking response - authentication error
 */
export const failedBookingResponseAuth = [
  {
    isSuccess: "false",
    message: "Invalid username or password",
    orderReferenceId: "",
  },
];

/**
 * Failed booking response - invalid destination city
 */
export const failedBookingResponseInvalidCity = [
  {
    isSuccess: "false",
    message: "Invalid destination city",
    orderReferenceId: "",
  },
];

/**
 * Failed booking response - invalid account
 */
export const failedBookingResponseInvalidAccount = [
  {
    isSuccess: "false",
    message: "Invalid account number",
    orderReferenceId: "",
  },
];

/**
 * Invalid response - not an array
 */
export const invalidBookingResponseNotArray = {
  isSuccess: "true",
  message: "Order saved successfully!",
  orderReferenceId: "544794010101495",
};

/**
 * Invalid response - empty array
 */
export const invalidBookingResponseEmptyArray: unknown[] = [];

/**
 * Invalid response - missing required fields
 */
export const invalidBookingResponseMissingFields = [
  {
    isSuccess: "true",
    // missing 'message' field
    orderReferenceId: "544794010101495",
  },
];

/**
 * Invalid response - wrong field types
 */
export const invalidBookingResponseWrongTypes = [
  {
    isSuccess: true, // should be string, not boolean
    message: "Order saved successfully!",
    orderReferenceId: "544794010101495",
  },
];

/**
 * Booking request parameters (without auth credentials and auto-injected config)
 * This is what users will pass to the client.booking() method
 * Note: username, password, AccountNo, InsertType, ReturnLocation, subAccountId
 * are automatically injected from client config
 */
export const bookingParamsWithoutAuth = {
  locationID: "41",
  consigneeName: "Aleeza Moazzam",
  consigneeAddress: "DHA KHI",
  consigneeMobNo: "03134568904",
  consigneeEmail: "aleeza@mulphilog.com",
  destinationCityName: "islamabad",
  pieces: 1,
  weight: 1,
  codAmount: 1,
  custRefNo: "test_1234",
  productDetails: "New Mobile",
  fragile: "YES" as const,
  service: "Overnight" as const,
  remarks: "Call Before Delivery",
  insuranceValue: "0",
};
