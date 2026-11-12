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