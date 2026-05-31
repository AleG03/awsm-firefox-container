/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Handler page: invoked by Firefox when the user navigates to an `ext+container:` URL. It pulls the full request from the query string, forwards it to the background script and closes itself.
(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("u");
    if (!raw) return;

    await browser.runtime.sendMessage({ type: "awsm:open", raw });
  } catch (err) {
    console.error("AWSM container handler error:", err);
  } finally {
    const tab = await browser.tabs.getCurrent();
    if (tab && typeof tab.id === "number") {
      browser.tabs.remove(tab.id).catch(() => {});
    }
  }
})();
