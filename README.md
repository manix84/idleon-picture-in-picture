# Idleon PiP

[![Release Chrome Extension](https://github.com/manix84/idleon-picture-in-picture/actions/workflows/release-extension.yml/badge.svg)](https://github.com/manix84/idleon-picture-in-picture/actions/workflows/release-extension.yml)

Play **Legends of Idleon** in Picture-in-Picture mode while browsing, working, or doing literally anything else.

> A lightweight Chrome extension for playing Idleon in Picture-in-Picture.

---

## ✨ Features

- 🎮 One-click Picture-in-Picture mode
- 🪟 Always-on-top floating game window
- ⚡ Lightweight and fast (no dependencies)
- 🧠 Remembers PiP window size/position (handled by Chrome)
- 🎯 Runs only on the Idleon website
- 🖱️ Optional floating control button
- ⌨️ Keyboard shortcuts for quick access
- 🧼 Automatically restores the page when PiP closes

---

## 🚀 How to Use

### Open PiP

- Click the extension icon
  **or**
- Click the floating button (bottom-right of the page)

---

### Close PiP

- Click the extension icon again
- Click the floating button
- Close the PiP window directly

---

## ⌨️ Keyboard Shortcuts

### Reveal PiP Controls

Ctrl + Shift + Y
Cmd + Shift + Y (Mac)

- Restores the floating button if hidden
- Highlights the button
- Prompts you to click it

👉 Due to browser security restrictions, PiP cannot reliably be opened directly via keyboard shortcut.

---

### Restore Hidden Button

Ctrl + Shift + P
Cmd + Shift + P (Mac)

---

## 🖱️ Floating Button

A small button appears in the bottom-right corner:

- Click → Toggle PiP
- Right-click → Hide button

If hidden, use the shortcut above to restore it.

---

## 🔄 Auto PiP (Experimental)

Idleon PiP attempts to open PiP automatically when you switch tabs.

- If PiP was auto-opened → it closes when you return
- If PiP was manually opened → it stays open

⚠️ This feature is limited by browser security policies and may not always trigger.

---

## 🔒 Privacy

Idleon PiP:

- ❌ Does NOT collect data
- ❌ Does NOT track users
- ❌ Does NOT communicate with servers

Everything runs locally in your browser.

See [privacy.md](./privacy.md)

---

## 🛠️ Installation (Development)

1. Clone the repository
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder

---

## 📦 Project Structure

/src
content.js
background.js
/icons
icon16.png
icon32.png
icon48.png
icon128.png
manifest.json

---

## ⚠️ Known Limitations

- Chrome requires **direct user interaction** to open PiP
- Keyboard shortcuts cannot reliably trigger PiP directly
- Auto PiP may not work depending on browser state
- PiP window size/position is controlled by Chrome

---

## 🧠 How It Works

The extension:

1. Injects a script into the Idleon page
2. Moves the game container into a PiP window
3. Preserves layout and styling
4. Restores everything when PiP is closed
