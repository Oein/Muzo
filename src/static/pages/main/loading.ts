let loader = document.getElementById("loadingContainer") as HTMLDivElement;

export function load() {
  loader.style.display = "block";
}

export function done() {
  loader.style.display = "none";
}

window.addEventListener("DOMContentLoaded", done);
