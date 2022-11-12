function toggleFullScreen() {
  let element = document.body as any;
  try {
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) return element.requestFullscreen();
      if (element.webkitRequestFullscreen)
        return element.webkitRequestFullscreen();
      if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
      if (element.msRequestFullscreen) return element.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) return document.exitFullscreen();
      if ((document as any).webkitCancelFullscreen)
        return (document as any).webkitCancelFullscreen();
      if ((document as any).mozCancelFullScreen)
        return (document as any).mozCancelFullScreen();
      if ((document as any).msExitFullscreen)
        return (document as any).msExitFullscreen();
    }
  } catch (e) {}
}

document
  .getElementById("fullscreen")
  ?.addEventListener("click", toggleFullScreen);
