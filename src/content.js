(() => {
  const STATE_KEY = "__idleon_pip_state__";
  const BUTTON_ID = "__idleon_pip_button__";
  const MOVED_SELECTOR = "#content-container";

  if (window[STATE_KEY]?.initialized) {
    window[STATE_KEY].ensureButton?.();
    return;
  }

  const state = {
    initialized: true,
    pipWindow: null,
    placeholderNode: null,
    movedEl: null,
    originalInlineStyle: null,
    buttonCheckTimer: null,
  };

  window[STATE_KEY] = state;

  function getMovedElement() {
    return document.querySelector(MOVED_SELECTOR);
  }

  function updateButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;

    btn.textContent =
      state.pipWindow && !state.pipWindow.closed
        ? "Close Idleon PiP"
        : "Open Idleon PiP";
  }

  function createButton() {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.type = "button";
    btn.textContent = "Open Idleon PiP";

    Object.assign(btn.style, {
      position: "fixed",
      top: "12px",
      right: "12px",
      zIndex: "2147483647",
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      background: "#1f6feb",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      lineHeight: "1.2",
      userSelect: "none",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.filter = "brightness(1.08)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.filter = "brightness(1)";
    });

    btn.addEventListener("click", () => {
      window.__idleonTogglePip?.();
    });

    return btn;
  }

  function ensureButton() {
    if (!document.body) return;

    let btn = document.getElementById(BUTTON_ID);
    if (!btn) {
      btn = createButton();
      document.body.appendChild(btn);
    }

    updateButton();
  }

  state.ensureButton = ensureButton;

  function startButtonKeeper() {
    if (state.buttonCheckTimer) return;

    state.buttonCheckTimer = window.setInterval(() => {
      ensureButton();
    }, 1500);
  }

  function restoreOriginalStyles() {
    if (!state.movedEl) return;

    if (state.originalInlineStyle === null) {
      state.movedEl.removeAttribute("style");
    } else {
      state.movedEl.setAttribute("style", state.originalInlineStyle);
    }

    state.originalInlineStyle = null;
  }

  function restoreMovedElement() {
    if (!state.movedEl || !state.placeholderNode?.parentNode) return;

    try {
      state.placeholderNode.parentNode.insertBefore(
        state.movedEl,
        state.placeholderNode
      );
      state.placeholderNode.remove();
    } catch (error) {
      console.error("[Idleon PiP] Failed to restore moved element:", error);
    }

    state.placeholderNode = null;
    state.movedEl = null;
  }

  function closePip() {
    if (state.pipWindow && !state.pipWindow.closed) {
      state.pipWindow.close();
      return;
    }

    restoreOriginalStyles();
    restoreMovedElement();
    state.pipWindow = null;
    updateButton();
  }

  function copyStylesToDocument(targetDoc) {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        if (sheet.href) {
          const link = targetDoc.createElement("link");
          link.rel = "stylesheet";
          link.href = sheet.href;
          targetDoc.head.appendChild(link);
        } else if (sheet.cssRules) {
          const style = targetDoc.createElement("style");
          style.textContent = Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
          targetDoc.head.appendChild(style);
        }
      } catch (error) {
        // Ignore stylesheets we can't read, usually cross-origin.
      }
    }
  }

  async function openPip() {
    if (!("documentPictureInPicture" in window)) {
      alert(
        "[Idleon PiP] Document Picture-in-Picture is not supported in this browser."
      );
      return;
    }

    if (state.pipWindow && !state.pipWindow.closed) {
      state.pipWindow.focus();
      return;
    }

    const movedEl = getMovedElement();

    if (!movedEl) {
      alert(`[Idleon PiP] Could not find ${MOVED_SELECTOR}`);
      return;
    }

    const rect = movedEl.getBoundingClientRect();
    const width = Math.max(720, Math.round(rect.width || 960));
    const height = Math.max(405, Math.round(rect.height || 540));

    state.pipWindow = await window.documentPictureInPicture.requestWindow({
      width,
      height,
      preferInitialWindowPlacement: true,
    });

    const pipDoc = state.pipWindow.document;
    pipDoc.title = "Idleon PiP";

    copyStylesToDocument(pipDoc);

    Object.assign(pipDoc.documentElement.style, {
      margin: "0",
      width: "100%",
      height: "100%",
      background: "#000",
    });

    Object.assign(pipDoc.body.style, {
      margin: "0",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#000",
      display: "grid",
      placeItems: "center",
    });

    const wrapper = pipDoc.createElement("div");
    Object.assign(wrapper.style, {
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#000",
      display: "grid",
      placeItems: "center",
    });

    const placeholder = document.createComment("__idleon_pip_placeholder__");
    movedEl.parentNode.insertBefore(placeholder, movedEl);

    state.placeholderNode = placeholder;
    state.movedEl = movedEl;
    state.originalInlineStyle = movedEl.getAttribute("style");

    // Force the moved outer container to size itself relative to the PiP window.
    Object.assign(movedEl.style, {
      width: "100vw",
      height: "56.25vw",
      maxWidth: "177.77vh",
      maxHeight: "100vh",
      margin: "0",
      position: "relative",
      left: "",
      top: "",
      transform: "",
      transformOrigin: "",
    });

    wrapper.appendChild(movedEl);
    pipDoc.body.replaceChildren(wrapper);

    const handleClose = () => {
      restoreOriginalStyles();
      restoreMovedElement();
      state.pipWindow = null;
      updateButton();
    };

    state.pipWindow.addEventListener("pagehide", handleClose, { once: true });

    updateButton();
  }

  async function togglePip() {
    try {
      if (state.pipWindow && !state.pipWindow.closed) {
        closePip();
      } else {
        await openPip();
      }
    } catch (error) {
      console.error("[Idleon PiP] Failed to toggle PiP:", error);
      alert(`[Idleon PiP] Failed to toggle PiP: ${error?.message || error}`);
    }
  }

  window.__idleonTogglePip = togglePip;

  ensureButton();
  startButtonKeeper();

  console.log("[Idleon PiP] Ready.");
})();
