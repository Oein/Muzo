document.getElementById("close")?.addEventListener("click", () => {
  axios
    .get(
      `/api/account/signout/request?id=${sessionStorage.getItem("SessionKey")}`
    )
    .then((response) => {
      sessionStorage.removeItem("SessionKey");
      location.pathname = "/";
    });
});
