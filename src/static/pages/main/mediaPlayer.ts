import { audioExts, videoExts } from "./fileExts.js";

let media = document.getElementById("media") as HTMLSpanElement;
let audioContainer = document.getElementById(
  "audio-container"
) as HTMLDivElement;
let videoContainer = document.getElementById(
  "video-container"
) as HTMLDivElement;
let audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
let videoPlayer = document.getElementById("video-player") as HTMLVideoElement;
let audioName = document.querySelector("#albumName") as HTMLDivElement;
let trackName = document.querySelector("#trackName") as HTMLDivElement;
let audioNameB = document.querySelector("#albumNameB") as HTMLDivElement;
let trackNameB = document.querySelector("#trackNameB") as HTMLDivElement;
let playPause = document.querySelector("#play-pause-button") as HTMLDivElement;
let playPauseICON = document.querySelector(
  "#play-pause-button > span"
) as HTMLSpanElement;
let audioCurTime = document.querySelector("#current-time") as HTMLDivElement;
let audioMaxTime = document.querySelector("#track-length") as HTMLDivElement;
let secbefore = document.querySelector("#play-previous") as HTMLDivElement;
let secafter = document.querySelector("#play-next") as HTMLDivElement;
let timebar = document.querySelector("#seek-bar") as HTMLDivElement;
let seekArea = document.querySelector("#s-area") as HTMLDivElement;
let sHover = document.querySelector("#s-hover") as HTMLDivElement;
let insTime = document.querySelector("#ins-time") as HTMLDivElement;

enum PlayingType {
  Audio,
  Video,
  NotPlaying,
}

let playingFileName = "";
let playing: PlayingType = PlayingType.NotPlaying;
let paused = true;
let playingPlaylistIDX = -1;
export let audioFilePlaylist: {
  drive: string;
  path: string;
  filenames: string;
}[] = [];

videoPlayer.addEventListener("pause", videoPause);
videoPlayer.addEventListener("play", pauseFalse);
videoPlayer.addEventListener("load", videoPlayer.play);
audioPlayer.addEventListener("pause", audioPause);
audioPlayer.addEventListener("play", pauseFalse);
audioPlayer.addEventListener("load", audioPlayer.play);
audioPlayer.addEventListener("durationchange", audioDuration);
audioPlayer.addEventListener("timeupdate", audioTime);
playPause.addEventListener("click", clickPP);
secbefore.addEventListener("click", secb);
secafter.addEventListener("click", seca);
seekArea.addEventListener("mousemove", sareamove);
seekArea.addEventListener("mouseleave", sareaout);
seekArea.addEventListener("click", sareaclick);

function sareaout() {
  insTime.style.display = "none";
  sHover.style.width = "0px";
}

function sareaclick(e: MouseEvent) {
  let seekT = e.offsetX;
  let seekLoc = audioPlayer.duration * (seekT / seekArea.clientWidth);
  let fulls = Math.floor(seekLoc);
  audioPlayer.currentTime = fulls;
}

function sareamove(e: MouseEvent) {
  let seekT = e.offsetX;
  let seekLoc = audioPlayer.duration * (seekT / seekArea.clientWidth);

  sHover.style.width = `${seekT}px`;

  let tx_ = "";

  let fulls = Math.floor(seekLoc);
  let sec = fulls % 60;
  fulls -= sec;
  let min = fulls / 60;
  tx_ = `${min}:${pad2(sec)}`;
  if (min >= 60) {
    let hour = 0;
    let rmin = min % 60;
    min -= rmin;
    hour = min / 60;
    min = rmin;
    tx_ = `${hour}:${pad2(min)}:${pad2(sec)}`;
  }

  insTime.innerText = tx_;
  insTime.style.left = `${seekT}px`;
  insTime.style.marginLeft = "-21px";
  insTime.style.display = "block";
}

function secb() {
  audioPlayer.currentTime -= 10;
}

function seca() {
  audioPlayer.currentTime += 10;
}

function pauseFalse() {
  paused = false;
  classNamer();
}

function audioPause() {
  if (playing == PlayingType.Audio) {
    paused = true;
  }
  classNamer();
}

function videoPause() {
  if (playing == PlayingType.Video) {
    paused = true;
  }
  classNamer();
}

function clickPP() {
  paused = !paused;
  if (paused) audioPlayer.pause();
  else audioPlayer.play();
  classNamer();
}

function classNamer() {
  if (playing != PlayingType.NotPlaying && !paused)
    media.classList.add("playing");
  else media.classList.remove("playing");

  videoContainer.className = "";
  audioContainer.className = "";

  if (paused) {
    playPauseICON.innerText = " play_arrow ";
  } else {
    playPauseICON.innerText = " pause ";
  }

  if (playing == PlayingType.Audio) {
    audioContainer.className = "show";
  } else {
    audioPlayer.pause();
  }
  if (playing == PlayingType.Video) {
    videoContainer.className = "show";
  } else videoPlayer.pause();
}

function pad2(n: number) {
  return (n < 10 ? "0" : "") + n;
}

function audioDuration() {
  let fulls = Math.floor(audioPlayer.duration);
  let sec = fulls % 60;
  fulls -= sec;
  let min = fulls / 60;
  audioMaxTime.innerText = `${min}:${pad2(sec)}`;
  if (min >= 60) {
    let hour = 0;
    let rmin = min % 60;
    min -= rmin;
    hour = min / 60;
    min = rmin;
    audioMaxTime.innerText = `${hour}:${pad2(min)}:${pad2(sec)}`;
  }
}

function audioTime() {
  let fulls = Math.floor(audioPlayer.currentTime);
  let sec = fulls % 60;
  fulls -= sec;
  let min = fulls / 60;
  audioCurTime.innerText = `${min}:${pad2(sec)}`;
  if (min >= 60) {
    let hour = 0;
    let rmin = min % 60;
    min -= rmin;
    hour = min / 60;
    min = rmin;
    audioCurTime.innerText = `${hour}:${pad2(min)}:${pad2(sec)}`;
  }
  timebar.style.width = `${
    (audioPlayer.currentTime / audioPlayer.duration) * 100
  }%`;
}

function initAudioPlayer() {
  let base64String = "/images/musicNote.jpg";
  (document.querySelector("#album-art-img") as HTMLImageElement).src =
    base64String;
  (
    document.querySelector("#bg-artwork") as HTMLDivElement
  ).style.backgroundImage = `url(${base64String})`;
  trackName.innerText = "Unknown track";
  trackNameB.innerText = trackName.innerText;
  audioName.innerText = playingFileName;
  audioNameB.innerText = playingFileName;
  audioPlayer.playbackRate = Number(localStorage["audioPlaybackRate"]);

  window.jsmediatags.read(audioPlayer.src, {
    onSuccess: function (result) {
      function picturing() {
        if (!result.tags.picture) return;

        const data = result.tags.picture?.data;
        const format = result.tags.picture?.format;
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        base64String = `data:${format};base64,${window.btoa(base64String)}`;
        (document.querySelector("#album-art-img") as HTMLImageElement).src =
          base64String;
        (
          document.querySelector("#bg-artwork") as HTMLDivElement
        ).style.backgroundImage = `url(${base64String})`;
      }
      function naming() {
        if (!result.tags.title) return;
        audioName.innerText = result.tags.title;
        audioNameB.innerText = result.tags.title;
      }
      function tracking() {
        if (!result.tags.artist) return;
        trackName.innerText = result.tags.artist;
        trackNameB.innerText = result.tags.artist;
      }

      picturing();
      naming();
      tracking();
    },
    onError: function (error) {},
  });
}

export function play(drive: string, path: string, fileName: string) {
  let url = `/api/files/cat/?drive=${drive}&path=${
    path + fileName
  }&token=${sessionStorage.getItem("SessionKey")}`;

  audioPlayer.src = url;
  videoPlayer.src = url;
  playing = PlayingType.NotPlaying;

  let dns = fileName.split(".");
  if (
    (!fileName.startsWith(".") && dns.length >= 2) ||
    (fileName.startsWith(".") && dns.length >= 3)
  ) {
    let ext = dns[dns.length - 1].toLocaleLowerCase();
    if (audioExts.includes(ext)) {
      playing = PlayingType.Audio;
      paused = false;
      playingFileName = fileName;
      audioFilePlaylist.push({
        drive: drive,
        path: path,
        filenames: fileName,
      });
      playingPlaylistIDX = audioFilePlaylist.length - 1;
      initAudioPlayer();
    }
    if (videoExts.includes(ext)) {
      playing = PlayingType.Video;
      paused = false;
      playingFileName = fileName;
    }
  }
  classNamer();
}

export function focus() {
  if (playing == PlayingType.Video) videoPlayer.focus();
}

classNamer();
