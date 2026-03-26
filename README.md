# idleon-picture-in-picture

[![Release Chrome Extension](https://github.com/manix84/idleon-picture-in-picture/actions/workflows/release-extension.yml/badge.svg)](https://github.com/manix84/idleon-picture-in-picture/actions/workflows/release-extension.yml)

A Chrome extension for [Legends of Idleon](https://www.legendsofidleon.com/).

## What it does

- Click the extension toolbar button to move `#content-container-inner` into a PiP window.
- Click the extension again to close PiP and restore the content.
- Returning to the original tab also closes PiP automatically.
- The PiP window includes a small `Back to tab` button.

## Important limitation

Chrome's Document Picture-in-Picture API requires **user activation** when opening PiP. That means the extension can open PiP when you click the toolbar icon, but it cannot silently auto-open PiP just because the tab lost focus.

## Install locally

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `idleon-pip-extension`
5. Pin the extension to your toolbar
6. Open Legends of Idleon
7. Click the extension icon to toggle PiP
