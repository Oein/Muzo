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
