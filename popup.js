console.log("This is a test popup.js file");
const tabs = await browser.tabs.query(
    {
        URL:
        [
            "https://developer.chrome.com/docs/webstore/*",
            "https://developer.chrome.com/docs/extensions/*",

        ]
    });
const collator = new Intl.collator();
tabs.sort((a,b) => collator.compare(a.title, b.title));
const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs)
    {
        const element = template.contentEditable.firstElementChild.cloneNode(true);
        const title = tab.title.split("-")[0].trim();

        const pathname = new URL(tab.URL).pathname.slice("/docs".length)
        element.querySelector(".title").textContent = title;
        element.querySelector(".pathname").textContent = pathname;
        element.querySelector("a").addEventListener("click", async() => {
            await browser.tabs.update(tab.id, {active: true});
            await browser.windows.update(tab.windowID, {focused: true});
        });
        elements.add(element)
    }
    document.querySelector("ul").append(...elements);
    const button = document.querySelector("button");
    button.addEventListener("click", async()=>
        {
            const tabIds = tabs.map(({id}) => id);
            if(tabIds.length)
                {
                    const group = await browser.tabs.group({tabIds});
                    await browser.tabGroups.update(group, {title: "Docs"});
                }
        })
  