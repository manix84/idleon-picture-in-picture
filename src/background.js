chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (typeof window.__idleonTogglePip === "function") {
          window.__idleonTogglePip();
        } else {
          console.error("[Idleon PiP] Toggle function not found.");
        }
      },
    });
  } catch (error) {
    console.error("[Idleon PiP] Failed to toggle PiP:", error);
  }
});
