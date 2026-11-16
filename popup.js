const docsUrls = [
  "https://developer.chrome.com/docs/extensions/*",
  "https://developer.chrome.com/docs/webstore/*",
];

chrome.tabs.query({ url: docsUrls }, (tabs) => {
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title || "", b.title || ""));

  const template = document.getElementById("li_template");
  const list = document.querySelector("ul");
  const elements = [];

  for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);
    const title = (tab.title || "").split("-")[0].trim() || "Untitled";
    const pathname = tab.url ? new URL(tab.url).pathname.replace(/^\/docs/, "") : "";

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;

    const link = element.querySelector("a");
    link.href = tab.url || "#";
    link.addEventListener("click", async () => {
      if (typeof tab.id === "number") {
        await chrome.tabs.update(tab.id, { active: true });
      }
      if (typeof tab.windowId === "number") {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
    });

    elements.push(element);
  }

  list.append(...elements);

  const button = document.querySelector("button");
  button.addEventListener("click", async () => {
    const tabIds = tabs
      .map(({ id }) => id)
      .filter((id) => typeof id === "number");

    if (!tabIds.length) {
      return;
    }

    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, { title: "Docs" });
  });
});
