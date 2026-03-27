(() => {
  const STATE_KEY = "__idleon_pip_state__";
  const BUTTON_ID = "__idleon_pip_button__";
  const OVERLAY_ID = "__idleon_pip_overlay__";
  const TOAST_ID = "__idleon_pip_toast__";

  const MOVED_SELECTOR = "#content-container";
  const INNER_SELECTOR = "#content-container-inner";

  const HIDE_KEY = "__idleon_hide_button__";

  if (window[STATE_KEY]?.initialized) {
    window[STATE_KEY].ensureButton?.();
    return;
  }

  const state = {
    initialized: true,
    pipWindow: null,
    pipMode: null, // "manual" | "auto" | null
    placeholderNode: null,
    movedEl: null,
    originalInlineStyle: null,
    innerEl: null,
    innerOriginalStyle: null,
    blurAttemptedSinceVisible: false,
  };

  window[STATE_KEY] = state;

  function shouldHideButton() {
    return localStorage.getItem(HIDE_KEY) === "1";
  }

  function getMovedElement() {
    return document.querySelector(MOVED_SELECTOR);
  }

  function isPipOpen() {
    return !!(state.pipWindow && !state.pipWindow.closed);
  }

  function updateButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;

    btn.textContent = isPipOpen() ? "Close Idleon PiP" : "Open Idleon PiP";
  }

  function createButton() {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.type = "button";
    btn.textContent = "Open Idleon PiP";
    btn.title =
      "Open or close Picture-in-Picture for Idleon. Right-click to hide this button.";

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
      fontFamily: "system-ui, sans-serif",
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
      window.__idleonTogglePip?.("manual");
    });

    btn.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      localStorage.setItem(HIDE_KEY, "1");
      btn.remove();
      showToast("Idleon PiP button hidden. Press Ctrl/Cmd+Shift+P to restore.");
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
      maxWidth: "90vw",
    });

    message.innerHTML = `
      <div>Game moved to Picture-in-Picture</div>
      <div style="margin-top: 6px; font-size: 13px; font-weight: 400; opacity: 0.9;">
        Close the PiP window to return the game to the page
      </div>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);
  }

  function removeOverlay() {
    document.getElementById(OVERLAY_ID)?.remove();
  }

  function showToast(message = "Idleon PiP button restored") {
    if (!document.body) return;

    document.getElementById(TOAST_ID)?.remove();

    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = message;

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "16px",
      left: "16px",
      zIndex: "2147483647",
      padding: "8px 12px",
      borderRadius: "8px",
      background: "rgba(0,0,0,0.8)",
      color: "#fff",
      fontSize: "12px",
      fontFamily: "system-ui, sans-serif",
      boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      opacity: "0",
      transform: "translateY(10px)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
      pointerEvents: "none",
      maxWidth: "min(460px, calc(100vw - 32px))",
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";

      window.setTimeout(() => {
        toast.remove();
      }, 200);
    }, 2600);
  }

  function pulseButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;

    const oldTransform = btn.style.transform;
    const oldOpacity = btn.style.opacity;

    btn.style.opacity = "1";
    btn.style.transform = "scale(1.06)";

    window.setTimeout(() => {
      btn.style.transform = oldTransform || "translateY(0)";
      btn.style.opacity = oldOpacity || "0.8";
    }, 180);
  }

  function getReadablePipError(error, context = "open") {
    const message = error?.message || String(error || "");
    const name = error?.name || "";

    if (
      name === "NotAllowedError" ||
      /requires user activation/i.test(message)
    ) {
      return {
        title: "Chrome blocked Picture-in-Picture",
        body:
          context === "auto"
            ? "Chrome only allows this PiP window to open after a direct user action, like clicking the PiP button or the extension icon. The extension is working, but the browser rejected the automatic open."
            : "Chrome only allows this PiP window to open after a direct user action. Please try clicking the PiP button on the page or the extension icon.",
      };
    }

    if (name === "NotSupportedError") {
      return {
        title: "Picture-in-Picture is not available",
        body: "This browser or browser setting does not currently allow Document Picture-in-Picture on this page.",
      };
    }

    return {
      title: "Picture-in-Picture failed",
      body: message || "Chrome rejected the PiP request for an unknown reason.",
    };
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
      } catch {
        // Ignore stylesheets we can't read, usually cross-origin.
      }
    }
  }

  function applyInnerOverrides() {
    if (!state.movedEl) return;

    const inner = state.movedEl.querySelector(INNER_SELECTOR);
    if (!inner) return;

    state.innerEl = inner;
    state.innerOriginalStyle = inner.getAttribute("style");

    Object.assign(inner.style, {
      padding: "0",
      margin: "0",
      width: "100%",
      height: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
      boxSizing: "border-box",
    });
  }

  function restoreInnerOverrides() {
    if (!state.innerEl) return;

    if (state.innerOriginalStyle === null) {
      state.innerEl.removeAttribute("style");
    } else {
      state.innerEl.setAttribute("style", state.innerOriginalStyle);
    }

    state.innerEl = null;
    state.innerOriginalStyle = null;
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

  function finishClose() {
    removeOverlay();
    restoreInnerOverrides();
    restoreOriginalStyles();
    restoreMovedElement();
    state.pipWindow = null;
    state.pipMode = null;
    updateButton();
  }

  function closePip() {
    if (isPipOpen()) {
      state.pipWindow.close();
      return;
    }

    finishClose();
  }

  async function openPip(options = {}) {
    const { mode = "manual", suppressErrors = false } = options;

    if (!("documentPictureInPicture" in window)) {
      if (!suppressErrors) {
        showToast(
          "Document Picture-in-Picture is not supported in this browser."
        );
      }
      return false;
    }

    if (isPipOpen()) {
      state.pipWindow.focus();
      return true;
    }

    const movedEl = getMovedElement();

    if (!movedEl) {
      if (!suppressErrors) {
        showToast(`Could not find ${MOVED_SELECTOR}`);
      }
      return false;
    }

    if (!movedEl.parentNode) {
      if (!suppressErrors) {
        showToast("Game container has no parent node.");
      }
      return false;
    }

    const rect = movedEl.getBoundingClientRect();
    const width = Math.max(720, Math.round(rect.width || 960));
    const height = Math.max(405, Math.round(rect.height || 540));

    try {
      state.pipWindow = await window.documentPictureInPicture.requestWindow({
        width,
        height,
        preferInitialWindowPlacement: false,
      });
    } catch (error) {
      const readable = getReadablePipError(
        error,
        mode === "auto" ? "auto" : "open"
      );

      console.warn("[Idleon PiP]", readable.title, error);

      if (!suppressErrors) {
        showToast(`${readable.title}: ${readable.body}`);
      }

      return false;
    }

    state.pipMode = mode;

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

    applyInnerOverrides();

    wrapper.appendChild(movedEl);
    pipDoc.body.replaceChildren(wrapper);

    showOverlay();

    const handleClose = () => {
      finishClose();
    };

    state.pipWindow.addEventListener("pagehide", handleClose, { once: true });

    updateButton();
    return true;
  }

  async function togglePip(mode = "manual") {
    if (isPipOpen()) {
      closePip();
      return;
    }

    await openPip({ mode });
  }

  function revealPipControl() {
    if (isPipOpen()) {
      closePip();
      return;
    }

    localStorage.removeItem(HIDE_KEY);
    ensureButton();
    pulseButton();
    showToast("Click the Idleon PiP button to open Picture-in-Picture");
  }

  function handleRestoreShortcut(event) {
    const isCombo =
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key.toLowerCase() === "p";

    if (!isCombo) return;

    event.preventDefault();

    if (isPipOpen()) {
      state.pipWindow?.focus();
      return;
    }

    if (shouldHideButton()) {
      localStorage.removeItem(HIDE_KEY);
      ensureButton();
      pulseButton();
      showToast("Idleon PiP button restored");
      return;
    }

    pulseButton();
    showToast("Click the Idleon PiP button to open Picture-in-Picture");
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      state.blurAttemptedSinceVisible = false;

      if (state.pipMode === "auto" && isPipOpen()) {
        closePip();
      }

      return;
    }

    if (state.blurAttemptedSinceVisible) return;
    state.blurAttemptedSinceVisible = true;

    if (!isPipOpen()) {
      void openPip({
        mode: "auto",
        suppressErrors: true,
      });
    }
  }

  window.__idleonTogglePip = togglePip;
  window.__idleonRevealPipControl = revealPipControl;

  window.addEventListener("keydown", handleRestoreShortcut);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  waitForBodyAndInject();

  console.log("[Idleon PiP] Ready.");
})();
