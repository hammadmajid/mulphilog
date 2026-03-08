# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of mulphilog
- TypeScript wrapper around Mulphilog (M&P) courier API
- Track consignment functionality
- Type-safe error handling with Result pattern
- Zero dependencies
- ESM-only package

## [0.1.0] - TBD

### Added

- Initial release
- Basic tracking functionality
- TypeScript support
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
