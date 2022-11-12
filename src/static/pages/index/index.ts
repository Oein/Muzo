let usernameInput: HTMLInputElement = document.getElementById(
  "usernameInput"
) as HTMLInputElement;

let passwordInput: HTMLInputElement = document.getElementById(
  "passwordInput"
) as HTMLInputElement;

let signinarticle: HTMLElement = document.getElementsByClassName(
  "signinarticle"
)[0]! as HTMLElement;

let signinbtn = document.getElementById("signinbtn") as HTMLDivElement;
let signin = document.getElementById("signin") as HTMLButtonElement;

const handle = () => {
  if (usernameInput.value.length > 0) {
    passwordInput.style.transform = "translateY(0%)";
    passwordInput.style.opacity = "1";
    passwordInput.disabled = false;
  } else {
    passwordInput.style.opacity = "0";
    passwordInput.style.transform = "translateY(-100%)";
    passwordInput.disabled = true;
    passwordInput.value = "";

    signinbtn.style.opacity = "0";
    signinbtn.style.transform = "translateY(-200%)";
    signinbtn.style.zIndex = "-1";
  }
};

const handle2 = () => {
  if (passwordInput.value.length > 0) {
    signinbtn.style.transform = "translateY(0%)";
    signinbtn.style.opacity = "1";
    signinbtn.style.zIndex = "1";
  } else {
    signinbtn.style.opacity = "0";
    signinbtn.style.transform = "translateY(-100%)";
    signinbtn.style.zIndex = "-1";
  }
};

usernameInput.addEventListener("change", handle);
usernameInput.addEventListener("keyup", handle);
passwordInput.addEventListener("change", handle2);
passwordInput.addEventListener("keyup", handle2);

handle();
handle2();

let axios;

let alertify = {
  error: (msg: string) => {
    alertify.show();
    alertify.textElement.innerText = msg;
    alertify.textElement.style.color = "var(--error)";
  },
  success: (msg: string) => {
    alertify.show();
    alertify.textElement.innerText = msg;
    alertify.textElement.style.color = "var(--success)";
  },
  show: () => {
    alertify.textElement.style.opacity = "1";
    alertify.lastShowed = new Date().getTime();
    setTimeout(alertify.hide, 1100);
  },
  hide: () => {
    if (new Date().getTime() - alertify.lastShowed < 1000) {
      return;
    }
    alertify.textElement.style.opacity = "0";
  },
  lastShowed: new Date().getTime() - 10000,
  textElement: document.getElementsByClassName(
    "signINerror"
  )[0] as HTMLDivElement,
};

function signinbtnHandler() {
  axios
    .post(
      `/api/account/signin/request?id=${usernameInput.value}&pw=${passwordInput.value}`
    )
    .then((v) => {
      let d = v.data as {
        e: string | null | undefined;
        s: string | null | undefined;
        k: string | null | undefined;
      };

      if (d.e) {
        alertify.error(d.e);
      } else {
        if (!d.s) return;
        if (!d.k) return;
        sessionStorage["SessionKey"] = d.k;
        alertify.success(d.s);
        location.pathname = "/main/";
      }
    })
    .catch((e) => {});
}

function enterKeyHandler(e: KeyboardEvent) {
  if (usernameInput.value.length == 0) return;
  if (passwordInput.value.length == 0) return;
  if (e.key == "Enter") signinbtnHandler();
}

function main() {
  signin.addEventListener("click", signinbtnHandler);

  usernameInput.addEventListener("keyup", enterKeyHandler);
  passwordInput.addEventListener("keyup", enterKeyHandler);
}

document.addEventListener("DOMContentLoaded", main);
main();
