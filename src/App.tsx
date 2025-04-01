import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupNoReelOption}>
        <input type="checkbox" />
        <p>
          If you want to remove the Reels option from your Instagram experience,
          simply check the box and click "Save" to apply the changes.
        </p>
      </div>
      <hr />
      <ul className={styles.ageOptionsContainer}>
        <li className={styles.ageHead}>Age between</li>
        <li className={styles.ageSelectOption}>
          <input type="checkbox" name="" id="" />
          1-5
        </li>
        <li className={styles.ageSelectOption}>
          <input type="checkbox" name="" id="" />
          5-10
        </li>
        <li className={styles.ageSelectOption}>
          <input type="checkbox" name="" id="" />
          10-15
        </li>
        <li className={styles.ageSelectOption}>
          <input type="checkbox" name="" id="" />
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
        <button className={styles.saveBtn}>Save</button>
      </div>
    </div>
  );
}

export default App;
