chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.url) {
    // console.log("Received URL:", message.url);
    chrome.runtime.sendMessage(
      { action: "fetch_page", url: message.url },
      (response) => {
        if (response.body) {
          const allVideoTags = document.body.querySelector("video");

          console.log("allVideoTags", allVideoTags);
        } else {
          console.error("Failed to fetch body:", response.error);
        }
      }
    );
  }
});
