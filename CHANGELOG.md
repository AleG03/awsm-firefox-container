# Changelog

## [1.0.0] - 2026-05-31

### Added

- Initial release as standalone repository (previously embedded in [awsm])
- `ext+container:` protocol handler for Firefox Multi-Account Containers
- Deterministic container color and icon based on FNV-1a hash of container name
- Options page to toggle URL-supplied color/icon hints
- Drop-in compatible with [open-url-in-container](https://github.com/honsiorovskyi/open-url-in-container) protocol
- URL scheme whitelist (http, https, ftp, about:blank)
- Container name length cap (128 chars)
- Internationalization support (English)
