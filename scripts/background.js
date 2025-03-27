function sendUrlToActiveTab(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { url: url }, (response) => {
        if (chrome.runtime.lastError) {
          console.log(
            "Content script not available yet:",
            chrome.runtime.lastError
          );
        }
      });
    }
  });
}

chrome.tabs.onActivated.addListener((activeTab) => {
  chrome.tabs.get(activeTab.tabId, (tab) => {
    if (chrome.runtime.lastError) return;

    if (tab.url && tab.url.includes("https://www.instagram.com")) {
      sendUrlToActiveTab(tab.url);
    }
  });
});

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    sendUrlToActiveTab(details.url);
  },
  { urls: ["<all_urls>"] }
);

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    sendUrlToActiveTab(details.url);
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetch_page") {
    fetch(message.url)
      .then((response) => response.text())
      .then((html) => {
        let bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        let extractedBody = bodyContent
          ? bodyContent[1]
          : "No body content found";

        sendResponse({ body: extractedBody });
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
        sendResponse({ error: "Failed to fetch page." });
      });

    return true;
  }
});