(() => {
  const STATE_KEY = "__idleon_pip_state__";
  const BUTTON_ID = "__idleon_pip_button__";
  const OVERLAY_ID = "__idleon_pip_overlay__";
  const MOVED_SELECTOR = "#content-container";
  const HIDE_KEY = "__idleon_hide_button__";

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
  };

  window[STATE_KEY] = state;

  function shouldHideButton() {
    return localStorage.getItem(HIDE_KEY) === "1";
  }

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
    btn.title = "Open or close Picture-in-Picture for Idleon";

    Object.assign(btn.style, {
      position: "fixed",
      bottom: "16px",
      right: "16px",
      zIndex: "2147483647",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(31, 111, 235, 0.85)",
      color: "#fff",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      fontSize: "12px",
      fontWeight: "600",
      lineHeight: "1.2",
      cursor: "pointer",
      userSelect: "none",
      opacity: "0.8",
      boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.opacity = "1";
      btn.style.transform = "translateY(-1px)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.opacity = "0.8";
      btn.style.transform = "translateY(0)";
    });

    btn.addEventListener("click", () => {
      window.__idleonTogglePip?.();
    });

    btn.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      localStorage.setItem(HIDE_KEY, "1");
      btn.remove();
      removeOverlay();
      console.log("[Idleon PiP] Floating button hidden. Clear localStorage key to restore.");
    });

    return btn;
  }

  function ensureButton() {
    if (!document.body) return;
    if (shouldHideButton()) return;

    let btn = document.getElementById(BUTTON_ID);
    if (!btn) {
      btn = createButton();
      document.body.appendChild(btn);
    }

    updateButton();
  }

  state.ensureButton = ensureButton;

  function waitForBodyAndInject() {
    if (document.body) {
      ensureButton();
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.body) {
        ensureButton();
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function showOverlay() {
    if (!document.body) return;
    if (document.getElementById(OVERLAY_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      background: "rgba(0,0,0,0.55)",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      pointerEvents: "none",
      backdropFilter: "blur(2px)",
      WebkitBackdropFilter: "blur(2px)",
    });

    const message = document.createElement("div");
    Object.assign(message.style, {
      padding: "14px 18px",
      borderRadius: "12px",
      background: "rgba(0,0,0,0.55)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      fontFamily: "system-ui, sans-serif",
      fontSize: "16px",
      fontWeight: "600",
      lineHeight: "1.3",
      textAlign: "center",
    });
    message.textContent = "Game moved to Picture-in-Picture";

    overlay.appendChild(message);
    document.body.appendChild(overlay);
  }

  function removeOverlay() {
    document.getElementById(OVERLAY_ID)?.remove();
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

    removeOverlay();
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

    if (!movedEl.parentNode) {
      alert("[Idleon PiP] Game container has no parent node.");
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

    showOverlay();

    const handleClose = () => {
      removeOverlay();
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

  waitForBodyAndInject();

  console.log("[Idleon PiP] Ready.");
})();
