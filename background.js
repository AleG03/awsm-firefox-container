/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * AWSM Container Opener - background script
 *
 * Receives `awsm:open` messages from handler.html (triggered by an
 * `ext+container:` navigation), parses the request, creates the container
 * if needed, and opens the target URL inside it.
 *
 * Drop-in compatible with the legacy `open-url-in-container` protocol:
 *     ext+container:name=<container>&url=<target>[&color=...&icon=...]
 *
 * Improvements over the legacy extension:
 *  - URL scheme whitelist (only http/https/ftp/about:blank are allowed).
 *  - Container name length cap to prevent abuse.
 *  - Deterministic color + icon derived from the container name (so the
 *    same container always renders with the same visual identity).
 *  - The `color` / `icon` query parameters are honored only if the user
 *    explicitly opted-in via the options page (default: ignore them).
 */

const ALLOWED_SCHEMES = ["http:", "https:", "ftp:", "about:blank"];
const MAX_NAME_LEN = 128;

// Mirror Firefox's contextual identity palette so we can pick deterministically.
const COLORS = [
  "blue", "turquoise", "green", "yellow",
  "orange", "red", "pink", "purple",
  "toolbar",
];
const ICONS = [
  "fingerprint", "briefcase", "dollar", "cart", "circle",
  "gift", "vacation", "food", "fruit", "pet", "tree", "chill",
  "fence",
];

// FNV-1a 32-bit. Stable, fast, no crypto needed for a visual hash.
function hash32(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function deterministicColor(name) {
  return COLORS[hash32("color:" + name) % COLORS.length];
}

function deterministicIcon(name) {
  return ICONS[hash32("icon:" + name) % ICONS.length];
}

async function getOptions() {
  const defaults = { honorUrlColorIcon: false };
  try {
    const stored = await browser.storage.local.get(defaults);
    return { ...defaults, ...stored };
  } catch {
    return defaults;
  }
}

// Parses a raw "ext+container:name=...&url=..." request.
// We do NOT use the URL parser on the whole thing because `ext+container:` is an opaque scheme without a host; we work directly on the scheme-relative part.
function parseRequest(raw) {
  if (typeof raw !== "string") throw new Error("invalid request");

  const prefix = "ext+container:";
  if (!raw.toLowerCase().startsWith(prefix)) {
    throw new Error("unsupported scheme");
  }
  const body = raw.slice(prefix.length);
  const params = new URLSearchParams(body);

  const name = (params.get("name") || "").trim();
  const url = params.get("url") || "";
  const color = (params.get("color") || "").trim().toLowerCase();
  const icon = (params.get("icon") || "").trim().toLowerCase();

  if (!name) throw new Error("missing container name");
  if (name.length > MAX_NAME_LEN) throw new Error("container name too long");
  if (!url) throw new Error("missing url");

  // Validate the inner URL scheme.
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("invalid target url");
  }
  if (!ALLOWED_SCHEMES.includes(parsed.protocol)) {
    throw new Error("disallowed target scheme: " + parsed.protocol);
  }

  return { name, url: parsed.toString(), color, icon };
}

async function ensureContainer(name, urlColor, urlIcon, opts) {
  const existing = await browser.contextualIdentities.query({ name });
  if (existing && existing.length > 0) {
    return existing[0];
  }

  const allowHint = opts.honorUrlColorIcon;
  const color = allowHint && COLORS.includes(urlColor)
    ? urlColor
    : deterministicColor(name);
  const icon = allowHint && ICONS.includes(urlIcon)
    ? urlIcon
    : deterministicIcon(name);

  return await browser.contextualIdentities.create({ name, color, icon });
}

async function openInContainer(req) {
  const opts = await getOptions();
  const identity = await ensureContainer(req.name, req.color, req.icon, opts);
  await browser.tabs.create({
    url: req.url,
    cookieStoreId: identity.cookieStoreId,
  });
}

browser.runtime.onMessage.addListener(async (msg) => {
  if (!msg || msg.type !== "awsm:open") return;
  try {
    const req = parseRequest(msg.raw);
    await openInContainer(req);
  } catch (err) {
    console.error("AWSM container opener:", err);
  }
});
