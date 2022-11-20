let speedBTN = document.querySelector("#audioSpeed") as HTMLDivElement;
let audioPlayer = document.querySelector("#audio-player") as HTMLAudioElement;

if (localStorage["audioPlaybackRate"] == undefined)
  localStorage["audioPlaybackRate"] = 1;

audioPlayer.playbackRate = Number(localStorage["audioPlaybackRate"]);

let newPlaybackRate = {
  1: 1.25,
  1.25: 1.5,
  1.5: 1.75,
  1.75: 2,
  2: 0.25,
  0.25: 0.5,
  0.5: 0.75,
  0.75: 1,
};

speedBTN.addEventListener("click", () => {
  audioPlayer.playbackRate = newPlaybackRate[audioPlayer.playbackRate];
  (<any>window).notifier.info(
    `Audio play speed is set to ${audioPlayer.playbackRate * 100}%`
  );
  localStorage["audioPlaybackRate"] = audioPlayer.playbackRate;
});
