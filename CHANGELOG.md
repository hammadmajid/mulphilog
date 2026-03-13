# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-03-14

### Added

- Location methods: `getLocations()` and `getCities()` for retrieving available pickup/delivery locations
- Added `swagger.json` for API documentation
- Pull request and issue templates for better GitHub collaboration

### Changed

- **BREAKING:** Moved `locationID` from client configuration to booking request parameters. Client config no longer requires `locationID`; it must be passed with each booking request.
- **BREAKING:** Moved M&P credentials (`accountNo`, `locationID`, `insertType`, `returnLocation`, `subAccountId`) to client configuration. The booking API now only requires user-provided shipment details, with credentials automatically injected.
- Refactored to use Zod types more appropriately across endpoints

### Technical

- Enhanced booking API with improved POST request support
- Code formatting updates

## [0.3.0] - 2026-03-09

### Added

- **Booking API support** - Create bookings/shipments with comprehensive validation
  - New `booking()` method on Mulphilog client
  - Full POST request body support in HTTP client
  - Comprehensive test suite with 26 booking-specific tests (52 total tests)
  - Test fixtures for booking scenarios
  - `BookingParams` type for user-provided booking fields
  - `BookingResponse` schema with array validation and transformation

### Changed

- **Simplified booking configuration** - M&P provided credentials now configured at client level
  - Added `accountNo`, `locationID`, `insertType`, `returnLocation`, and `subAccountId` to `MulphilogOptions`
  - Credentials automatically injected in booking requests
  - Users only provide shipment-specific details, not M&P account configuration
  - Updated README with new configuration structure
- Enhanced error formatter to properly handle empty array validation errors
- Improved Zod error messages for array validation

### Technical

- Added POST/PUT request body support to `callEndpoint` function
- Updated `ClientConfig` to store M&P provided credentials
- Separated internal `BookingRequest` from public `BookingParams` type

## [0.2.1] - 2026-03-09

### Fixed

- Enhanced null and undefined checks for improved data handling
- Improved optional chaining and nullish coalescing for better error handling

### Changed

- Streamlined error handling and improved code readability in client.ts

### Added

- Test configuration with tsconfig.test.json
- Version update script for automated releases

## [0.2.0] - 2024-01-15

### Added

- Zod validation for runtime type checking
- Comprehensive test suite with Vitest
- Test coverage reporting (75% threshold)
- JSR package registry support
- Pre-commit formatting hooks with husky

### Changed

- Migrated from manual validation to Zod for better type safety
- Improved Zod validation error handling
- Enhanced date validation

### Fixed

- Proper Zod validation error handling

## [0.1.0] - 2024-01-01

### Added

- Initial release of mulphilog
- TypeScript wrapper around Mulphilog (M&P) courier API
- Track consignment functionality
- Type-safe error handling with Result pattern
- Zero dependencies (before Zod migration)
- ESM-only package
- Basic tracking functionality
- MIT License

---

## How to Update This Changelog

When making changes, add them under the `[Unreleased]` section using these categories:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

When releasing a new version:

1. Update package.json version
2. Move `[Unreleased]` changes to a new version section
3. Add the release date
4. Create a git tag: `git tag v0.1.0`
5. Push the tag: `git push origin v0.1.0`
