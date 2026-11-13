
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "OFF" });
});

const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id || !tab.url) {
    return;
  }

  const isAllowedPage =
    tab.url.startsWith(extensions) ||
    tab.url.startsWith(webstore);

  if (!isAllowedPage) {
    return;
  }

  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";

  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    await browser.scripting.insertCSS({
      files: ["focus-mode.css"],
      target: { tabId: tab.id },
    });
  } else {
    await browser.scripting.removeCSS({
      files: ["focus-mode.css"],
      target: { tabId: tab.id },
    });
  }
});

