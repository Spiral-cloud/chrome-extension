(() => {
    console.log("Chrome extension content script is running");

    const existingBadge = document.getElementById("chrome-extension-test-badge");
    if (existingBadge) {
        return;
    }

    const badge = document.createElement("div");
    badge.id = "chrome-extension-test-badge";
    badge.textContent = "Extension test: content script loaded";
    badge.style.position = "fixed";
    badge.style.bottom = "20px";
    badge.style.right = "20px";
    badge.style.zIndex = "999999";
    badge.style.background = "#1a73e8";
    badge.style.color = "white";
    badge.style.padding = "8px 12px";
    badge.style.borderRadius = "8px";
    badge.style.fontSize = "14px";
    badge.style.fontFamily = "Arial, sans-serif";
    badge.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

    document.body.appendChild(badge);
})();
function renderReadingTime(article) 
{
    if (!article) {
        console.warn("No article element found to calculate reading time.");
        return;
    }
    const text = article.textContent;
    const wordsMatchRegExp = /[^\s]+/g;
    const words = text.matchAll(wordsMatchRegExp);
    const wordCount = [...words].length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming average reading speed of 200 words per minute
    const badge = document.createElement("p");
    badge.classList.add("color-secondary-text", "type--caption");
    badge.textContent = `Reading time: ${readingTime} min`;

    const heading = article.querySelector("h1");
    const dateElement = article.querySelector("time");
    (dateElement ?? heading)?.insertAdjacentElement("afterend", badge);
}
renderReadingTime(document.querySelector('article'));

const  observer = new MutationObserver((mutationsList) => 
    {
        for (const mutation of mutationsList)
            {
                for (const addedNode of mutation.addedNodes)
                {
                    if (addedNode.nodeType === Node.TagName('article')) 
                    {
                        renderReadingTime(addedNode);
                    }
                }
            }

    });
observer.observe(document.querySelector('devsite-content'),
{
    childList: true,
});
