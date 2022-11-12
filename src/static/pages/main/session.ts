let session_id = sessionStorage.getItem("SessionKey");
let sessionValid = false;

function sessioning() {
  if (session_id == null) {
    location.pathname = "/";
    return;
  }

  console.log("session id", session_id);

  axios.get(`/api/account/session/valid?token=${session_id}`).then((v) => {
    console.log(v.data);
    if (v.data.e) {
      location.pathname = "/";
      return;
    } else {
      sessionValid = true;
      try {
        ((window as any).sessionGenerateDone as any)();
      } catch (e) {}
      sessionStorage.setItem("SessionKey", v.data.k);
    }
  });
}

sessioning();

export default () => {};
