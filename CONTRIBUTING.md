# Contributing to AWSM Container Opener

Thanks for your interest! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/AleG03/awsm-firefox-container.git
cd awsm-firefox-container
npm install
```

## Running locally

```bash
npm start          # launches Firefox with the extension loaded
npm run lint       # runs web-ext lint
npm run build      # produces an unsigned XPI in web-ext-artifacts/
```

## Submitting Changes

1. Fork the repo and create a branch from `main`.
2. Make your changes.
3. Run `npm run lint` and fix any warnings.
4. Open a pull request with a clear description.

## Code Style

- Vanilla JS (no transpilation).
- Manifest V3 APIs only.
- Keep the extension small and focused on the `ext+container:` protocol.

## License

By contributing you agree that your contributions will be licensed under the MPL-2.0.
