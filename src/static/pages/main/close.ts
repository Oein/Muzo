document.getElementById("close")?.addEventListener("click", () => {
  sessionStorage.removeItem("SessionKey");
  location.pathname = "/";
});
