const ContentScript = () => {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.url) {
      console.log(message.url);
    }
  });
  return (
    <div>
      <h1 style={{ color: "red" }}>Hey dude i am here</h1>
    </div>
  );
};

export default ContentScript;
