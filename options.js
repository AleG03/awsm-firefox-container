/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const cb = document.getElementById("honorUrlColorIcon");
const status = document.getElementById("status");

async function load() {
  const { honorUrlColorIcon = false } = await browser.storage.local.get({
    honorUrlColorIcon: false,
  });
  cb.checked = !!honorUrlColorIcon;
}

async function save() {
  await browser.storage.local.set({ honorUrlColorIcon: cb.checked });
  status.hidden = false;
  setTimeout(() => { status.hidden = true; }, 1200);
}

cb.addEventListener("change", save);
load();
