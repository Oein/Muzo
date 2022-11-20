import { os } from "./userAgent.js";

function withCOMMANDKey(e: KeyboardEvent) {
  return (
    ((os.includes("Mac") || os.includes("Apple")) && e.metaKey) ||
    ((os.includes("Windows") || os.includes("Linux")) && e.ctrlKey)
  );
}

window.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.code == "KeyA" && withCOMMANDKey(e)) {
    e.preventDefault();
    console.log("SELECT ALL");
  }
  if (e.code == "KeyX" && withCOMMANDKey(e)) {
    e.preventDefault();
    console.log("CUT");
  }
  if (e.code == "KeyC" && withCOMMANDKey(e)) {
    e.preventDefault();
    console.log("COPY");
  }
  if (e.code == "KeyV" && withCOMMANDKey(e)) {
    e.preventDefault();
    console.log("PASTE");
  }
});
