chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await togglePipInTab(tab.id);
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-pip") return;

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id) return;

  await revealPipControlInTab(tab.id);
});

async function ensureScript(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/content.js"],
  });
}

async function togglePipInTab(tabId) {
  try {
    await ensureScript(tabId);

    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        window.__idleonTogglePip?.("manual");
      },
    });
  } catch (error) {
    console.error("[Idleon PiP] Failed to toggle PiP:", error);
  }
}

async function revealPipControlInTab(tabId) {
  try {
    await ensureScript(tabId);

    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        window.__idleonRevealPipControl?.();
      },
    });
  } catch (error) {
    console.error("[Idleon PiP] Failed to reveal PiP control:", error);
  }
}
