
const audioPlayer = new Audio();
const playPauseBtn = document.getElementById("play-pause");
const stopBtn = document.getElementById("stop-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const trackName = document.getElementById("track-name");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const volumeControl = document.getElementById("volume-control");
const fileUpload = document.getElementById("file-upload");
const uploadBtn = document.getElementById("upload-btn");
const playlist = document.getElementById("playlist");


let currentTrackIndex = 0;
let tracks = [];


playPauseBtn.addEventListener("click", togglePlayPause);

function togglePlayPause() {
  if (tracks.length === 0) return;

  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.textContent = "❚❚";
  } else {
    audioPlayer.pause();
    playPauseBtn.textContent = "▶";
  }
}


stopBtn.addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  playPauseBtn.textContent = "▶";
});


nextBtn.addEventListener("click", playNextTrack);

function playNextTrack() {
  if (tracks.length > 0) {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(currentTrackIndex);
  }
}


prevBtn.addEventListener("click", playPreviousTrack);

function playPreviousTrack() {
  if (tracks.length > 0) {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(currentTrackIndex);
  }
}


audioPlayer.addEventListener("timeupdate", updateProgressBar);

function updateProgressBar() {
  if (audioPlayer.duration) {
    const progressPercent =
      (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
}


progressContainer.addEventListener("click", seekTrack);

function seekTrack(e) {
  if (audioPlayer.duration) {
    const progressWidth = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;

    audioPlayer.currentTime = (clickX / progressWidth) * duration;
  }
}


volumeControl.addEventListener("input", (e) => {
  audioPlayer.volume = e.target.value;
});


uploadBtn.addEventListener("click", () => {
  fileUpload.click();
});

fileUpload.addEventListener("change", handleFileUpload);

function handleFileUpload(e) {
  const newFiles = Array.from(e.target.files);
  tracks = [...tracks, ...newFiles];
  updatePlaylist();


  if (tracks.length > 0 && audioPlayer.paused) {
    currentTrackIndex = tracks.length - newFiles.length;
    playTrack(currentTrackIndex);
  }
}

function playTrack(index) {
  if (tracks.length > 0) {
    const track = tracks[index];
    audioPlayer.src = URL.createObjectURL(track);
    trackName.textContent = track.name;

    audioPlayer.onloadedmetadata = () => {
      audioPlayer.play();
      playPauseBtn.textContent = "❚❚";
    };

    const playlistItems = playlist.children;
    for (let i = 0; i < playlistItems.length; i++) {
      playlistItems[i].style.background =
        i === index ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)";
    }
  }
}

function updatePlaylist() {
  playlist.innerHTML = "";
  tracks.forEach((track, index) => {
    const playlistItem = document.createElement("div");
    playlistItem.classList.add("playlist-item");

    const trackNameSpan = document.createElement("span");
    trackNameSpan.textContent = track.name;
    trackNameSpan.addEventListener("click", () => {
      currentTrackIndex = index;
      playTrack(index);
    });

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add("playlist-item-delete");
    deleteBtn.addEventListener("click", () => {
      tracks.splice(index, 1);
      updatePlaylist();

 
      if (currentTrackIndex >= tracks.length) {
        currentTrackIndex = tracks.length - 1;
      }


      if (tracks.length === 0) {
        audioPlayer.pause();
        audioPlayer.src = "";
        trackName.textContent = "No Track Selected";
        playPauseBtn.textContent = "▶";
      }
    });

    playlistItem.appendChild(trackNameSpan);
    playlistItem.appendChild(deleteBtn);
    playlist.appendChild(playlistItem);
  });
}


audioPlayer.addEventListener("ended", playNextTrack);
