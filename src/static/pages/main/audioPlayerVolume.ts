let volumeBTN = document.querySelector("#audioVolume") as HTMLDivElement;
let audioPlayer_ = document.querySelector("#audio-player") as HTMLAudioElement;
let volumeicon = document.querySelector("#volumeIcon") as HTMLSpanElement;

function volumeICON() {
  let vol = audioPlayer_.volume;

  if (vol == 0) {
    volumeicon.innerText = "volume_off";
  }
  if (vol > 0 && vol <= 0.33) {
    volumeicon.innerText = "volume_mute";
  }
  if (vol > 0.33 && vol <= 0.66) {
    volumeicon.innerText = "volume_down";
  }
  if (vol > 0.66 && vol <= 1) {
    volumeicon.innerText = "volume_up";
  }
}

let newVol = {
  0: 0.1,
  0.1: 0.2,
  0.2: 0.3,
  0.3: 0.4,
  0.4: 0.5,
  0.5: 0.6,
  0.6: 0.7,
  0.7: 0.8,
  0.8: 0.9,
  0.9: 1,
  1: 0,
};

volumeBTN.addEventListener("click", () => {
  let vol = newVol[audioPlayer_.volume];
  audioPlayer_.volume = vol;
  localStorage["audioPlayer.volume"] = vol;
  (<any>window).notifier.info(
    `Audio volume is set to ${audioPlayer_.volume * 100}%`
  );
  volumeICON();
});

if (localStorage["audioPlayer.volume"] == undefined)
  localStorage["audioPlayer.volume"] = 1;
audioPlayer_.volume = localStorage["audioPlayer.volume"];
volumeICON();
