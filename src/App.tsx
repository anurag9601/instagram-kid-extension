import styles from "./App.module.css";
import React from "react";

function App() {
  const [reelHideCheck, setReelHideCheck] = React.useState<boolean>(false);

  const [ageLimit, setAgeLimit] = React.useState<number>(0);

  async function handleRefreshTheCurrentTab() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.id) {
      chrome.runtime.sendMessage({ action: "reloadTab", tabId: tab.id });
    }
  }

  function handleSetAgeLimitOnChange(n: number) {
    chrome.storage.sync.set({ ageLimit: n });
    setAgeLimit(n);
  }

  async function getHistoryData() {
    chrome.storage.sync.get(["reelOptionVisible"], (response) => {
      setReelHideCheck(response.reelOptionVisible);
    });
    chrome.storage.sync.get(["ageLimit"], (response) => {
      if (response.ageLimit) {
        setAgeLimit(response.ageLimit);
      }
    });
  }

  React.useLayoutEffect(() => {
    getHistoryData();
  }, []);

  React.useEffect(() => {
    chrome.storage.sync.set({ reelOptionVisible: reelHideCheck });
  }, [reelHideCheck]);
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupNoReelOption}>
        <input
          type="checkbox"
          onChange={() => {
            setReelHideCheck((prev) => !prev);
          }}
          checked={reelHideCheck}
        />
        <p style={{ display: "flex", flexDirection: "column" }}>
          If you want to remove the Reels option from your Instagram experience,
          simply check the box and click "Save" to apply the changes.
          <span style={{ color: "red" }}>
            Note: After any changes reloading the page is recommended
          </span>
        </p>
      </div>
      <hr />
      <ul className={styles.ageOptionsContainer}>
        <li className={styles.ageHead}>Age between</li>
        <li className={styles.ageSelectOption}>
          <input
            type="checkbox"
            onChange={() => handleSetAgeLimitOnChange(5)}
            checked={ageLimit === 5}
          />
          1-5
        </li>
        <li className={styles.ageSelectOption}>
          <input
            type="checkbox"
            onChange={() => handleSetAgeLimitOnChange(10)}
            checked={ageLimit === 10}
          />
          5-10
        </li>
        <li className={styles.ageSelectOption}>
          <input
            type="checkbox"
            onChange={() => handleSetAgeLimitOnChange(15)}
            checked={ageLimit === 15}
          />
          10-15
        </li>
        <li className={styles.ageSelectOption}>
          <input
            type="checkbox"
            onChange={() => handleSetAgeLimitOnChange(18)}
            checked={ageLimit === 18}
          />
          15-18
        </li>
      </ul>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button className={styles.saveBtn} onClick={handleRefreshTheCurrentTab}>
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
