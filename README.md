# Picture in Picture mode for Legends of Idleon

[![Release Chrome Extension](https://github.com/manix84/idleon-picture-in-picture/actions/workflows/release-extension.yml/badge.svg)](https://github.com/manix84/idleon-picture-in-picture/actions/workflows/release-extension.yml)

Play **Legends of Idleon** in Picture-in-Picture mode while browsing, working, or doing literally anything else.

> A lightweight Chrome extension for playing Idleon in Picture-in-Picture.

---

## 🧩 Install from Chrome Web Store

👉 https://chromewebstore.google.com/detail/idleon-pip/genkdpliffdkinghiceifmkoiglfomod

---

## 📸 Screenshots

<p align="center">
  <a href="https://lh3.googleusercontent.com/fQk_ctzUYrghGTv30XYLdNcm_ONm6cN857KWLcKufA1Qi4AdmOkPVG0kN9oHReA55rzROSATohlHfeUZCjwHH_Nltg=s1600-w1600-h1000" target="_blank" rel="noopener noreferrer"><img src="https://lh3.googleusercontent.com/fQk_ctzUYrghGTv30XYLdNcm_ONm6cN857KWLcKufA1Qi4AdmOkPVG0kN9oHReA55rzROSATohlHfeUZCjwHH_Nltg=s1600-w1600-h1000" alt="Legends of Idleon playing with PiP button in the bottom right-hand corner" width="30%" /></a>
  <a href="https://lh3.googleusercontent.com/PGB43TZRpOpvVgJgCpk-ZwAR1wQGmDlKJ5OKWavQcjHo_2-U9IEa2SHbDB1x6ZO8qvt7E60Q8vklWg63TsGEqJIz=s1600-w1600-h1000" target="_blank" rel="noopener noreferrer"><img src="https://lh3.googleusercontent.com/PGB43TZRpOpvVgJgCpk-ZwAR1wQGmDlKJ5OKWavQcjHo_2-U9IEa2SHbDB1x6ZO8qvt7E60Q8vklWg63TsGEqJIz=s1600-w1600-h1000" alt="Legends of Idleon playing in PiP mode, over the normal Idleon window." width="30%" /></a>
  <a href="https://lh3.googleusercontent.com/4eh82hJfb2SVLCnYduYlAMJfsgEfLZsGZjEBophRnmajpHDZ9OzqZA-44ZGWErXigqI0_vuMSgscHZQz6EHO29_8O2o=s1600-w1600-h1000" target="_blank" rel="noopener noreferrer"><img src="https://lh3.googleusercontent.com/4eh82hJfb2SVLCnYduYlAMJfsgEfLZsGZjEBophRnmajpHDZ9OzqZA-44ZGWErXigqI0_vuMSgscHZQz6EHO29_8O2o=s1600-w1600-h1000" alt="Legends of Idleon playing over the top of another browser window" width="30%" /></a>
</p>

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

## 🌍 Languages

Idleon PiP now supports multiple languages via Chrome’s built-in localisation system.

Supported languages:
- English (UK)  
- English (US)  
- French  
- German  
- Korean  
- Japanese  
- Chinese (Simplified)  
- Chinese (Traditional)  

The extension will automatically use your browser’s language where available.

These languages were chosen to keep it in line with those supported by Legends of Idleon. If you'd like more added, feel free to contribute!

---

## 🧠 Contributing to Languages

Translations are simple JSON files located in:

```
_locales/<locale>/messages.json
```

If you’d like to improve an existing translation or add a new language, feel free to open a PR!

Please keep message keys consistent across all locale files.

---

## 🛠️ Installation (Development)

1. Clone the repository  
2. Open Chrome → `chrome://extensions/`  
3. Enable **Developer mode**  
4. Click **Load unpacked**  
5. Select the project folder  

---

## 📦 Project Structure

- _locales/
  - en_GB/*messages.json*
  - en_US/*messages.json*
  - fr/*messages.json*
  - de/*messages.json*
  - ko/*messages.json*
  - ja/*messages.json*
  - zh_CN/*messages.json*
  - zh_TW/*messages.json*
- src/
  - content.js
  - background.js
- icons/
  - icon16.png
  - icon32.png
  - icon48.png
  - icon128.png
- manifest.json

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
