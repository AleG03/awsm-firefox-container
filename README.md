# AWSM Container Opener

[![AMO](https://img.shields.io/amo/v/awsm-container?label=Firefox%20Add-on)](https://addons.mozilla.org/firefox/addon/awsm-container/)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](LICENSE)

A Firefox WebExtension that opens URLs inside **Multi-Account Containers** via
the `ext+container:` protocol. Companion extension for the
[awsm](https://github.com/AleG03/awsm) CLI.

## Install

**From AMO (recommended):**

<https://addons.mozilla.org/firefox/addon/awsm-container/>

Or via the awsm CLI:

```bash
awsm extension install   # opens the AMO listing in your browser
```

## Protocol

```
ext+container:name=<container-name>&url=<target-url>[&color=<color>&icon=<icon>]
```

Only `http`, `https`, `ftp` and `about:blank` target URLs are accepted.

Drop-in compatible with
[open-url-in-container](https://github.com/honsiorovskyi/open-url-in-container)
extension.

## Behavior

- **Deterministic visuals (default):** The container color and icon are derived
  from a hash of the container name, so the same AWS profile always looks the
  same.
- **Existing containers are never re-colored.** If a container already exists,
  it is reused as-is.
- **Opt-in URL hints:** Toggle "Honor color/icon from the URL" in the options
  page to respect explicit `color=` / `icon=` query parameters on first
  container creation.

## Development

```bash
npm install
npm start        # launches Firefox with the extension loaded
npm run lint     # web-ext lint
npm run build    # produces unsigned XPI in web-ext-artifacts/
```

## Release

Releases are automated via GitHub Actions. Push a tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

The `release.yml` workflow signs and submits to AMO. Required secrets:
- `AMO_JWT_ISSUER` — your AMO API key
- `AMO_JWT_SECRET` — your AMO API secret

## License

[Mozilla Public License 2.0](LICENSE)
