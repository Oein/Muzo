import { sessionGenerateDone } from "./fileSystem.js";
import { done, load } from "./loading.js";

let session_id = sessionStorage.getItem("SessionKey");
(window as any).sessionValid = false;

function sessioning() {
  if (session_id == null) {
    location.pathname = "/";
    return;
  }

  console.log("session id", session_id);

  load();
  axios.get(`/api/account/session/valid?token=${session_id}`).then((v) => {
    done();
    console.log(v.data);
    if (v.data.e) {
      location.pathname = "/";
      return;
    } else {
      sessionStorage.setItem("SessionKey", v.data.k);
      sessionGenerateDone();
    }
  });
}

sessioning();

export default () => {};
