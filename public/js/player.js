fileInput = document.getElementById('file-input')
songMenu = document.getElementById('song-menu')

const fDir = 'G:/Other computers/My Computer/Songs/gp7/Video Game/'
let fName = ''

songMenu.addEventListener('change', function() {
  if (songMenu.value != 'none') {
    loadSong(songMenu.value)
  }
})

fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0]
        fileInfo.textContent = file.name;
        fName = file.name
        console.log(fName)
        data = {
            path: fDir,
            name: fName
        }
        loadSong(fName)
    }
})
console.log('fname = ' + fName)
// window.addEventListener('load', function () {
//     alphaTab.init({
//       target: '#tabContainer',
//       file: '/path/to/your-file.gp5', // Load your Guitar Pro file here
//       player: {
//         enablePlayer: true, // Enable playback
//         enableUserInteraction: true // Allow user interaction
//       }
//     });
//   });


//initialize 
function loadSong(name) {


// load elements
const wrapper = document.querySelector(".at-wrap");
const main = wrapper.querySelector(".at-main");
main.innerHTML = ''
// initialize alphatab
const settings = {
// file: "https://www.alphatab.net/files/canon.gp",
file: '/player/' + name,
player: {
    enablePlayer: true,
    soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2',
    scrollElement: wrapper.querySelector('.at-viewport') // this is the element to scroll during playback
}
};
const api = new alphaTab.AlphaTabApi(main, settings);


  // overlay logic
const overlay = wrapper.querySelector(".at-overlay");
api.renderStarted.on(() => {
  overlay.style.display = 'flex';
});
api.renderFinished.on(() => {
  overlay.style.display = 'none';
});

// helper function to create individual items
function createTrackItem(track) {
    const trackItem = document
      .querySelector("#at-track-template")
      .content.cloneNode(true).firstElementChild;
    trackItem.querySelector(".at-track-name").innerText = track.name;
    trackItem.track = track;
    trackItem.onclick = (e) => {
      e.stopPropagation();
      // here we use some API function of alphaTab. 
      // check the reference docs for the details.
      api.renderTracks([track]);
    };
    return trackItem;
  }
  
  
  const trackList = wrapper.querySelector(".at-track-list");
  // fill track list when the score is loaded
  api.scoreLoaded.on((score) => {
    // clear items
    trackList.innerHTML = "";
    // generate a track item for all tracks of the score
    score.tracks.forEach((track) => {
      trackList.appendChild(createTrackItem(track));
    });
  });
  
  // mark the rendered track as active in the list
  api.renderStarted.on(() => {
    // collect tracks being rendered
    const tracks = new Map();
    // here we access the currently rendered tracks of alphaTab
    api.tracks.forEach((t) => {
      tracks.set(t.index, t);
    });
    // mark the item as active or not
    const trackItems = trackList.querySelectorAll(".at-track");
    trackItems.forEach((trackItem) => {
      if (tracks.has(trackItem.track.index)) {
        trackItem.classList.add("active");
      } else {
        trackItem.classList.remove("active");
      }
    });
  });

  const countIn = wrapper.querySelector('.at-controls .at-count-in');
countIn.onclick = () => {
  countIn.classList.toggle('active');
  if (countIn.classList.contains('active')) {
    api.countInVolume = 1;
  } else {
    api.countInVolume = 0;
  }
};

const metronome = wrapper.querySelector('.at-controls .at-metronome');
metronome.onclick = () => {
  metronome.classList.toggle('active');
  if (metronome.classList.contains('active')) {
    api.metronomeVolume = 1;
  } else {
    api.metronomeVolume = 0;
  }
};

const loop = wrapper.querySelector('.at-controls .at-loop');
loop.onclick = () => {
  loop.classList.toggle('active');
  api.isLooping = loop.classList.contains('active');
};

wrapper.querySelector('.at-controls .at-print').onclick = () => {
    api.print();
  };

api.scoreLoaded.on((score)=>{
wrapper.querySelector('.at-song-title').innerText = score.title;
wrapper.querySelector('.at-song-artist').innerText = score.artist;
});

const zoom = wrapper.querySelector('.at-controls .at-zoom select');
zoom.onchange = ()=>{
  const zoomLevel = parseInt(zoom.value) / 100;
  api.settings.display.scale = zoomLevel;
  api.updateSettings();
  api.render();
};

const layout = wrapper.querySelector('.at-controls .at-layout select');
layout.onchange = () => {
  switch (layout.value) {
    case 'horizontal':
      api.settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
      break;
    case 'page':
      api.settings.display.layoutMode = alphaTab.LayoutMode.Page;
      break;
  }
  api.updateSettings();
  api.render();
};

const playerIndicator = wrapper.querySelector(
    ".at-controls .at-player-progress"
  );
  api.soundFontLoad.on((e) => {
    const percentage = Math.floor((e.loaded / e.total) * 100);
    playerIndicator.innerText = percentage + "%";
  });
  api.playerReady.on(()=>{
    playerIndicator.style.display = 'none';
  });

  const playPause = wrapper.querySelector(
    ".at-controls .at-player-play-pause"
  );
  const stop = wrapper.querySelector(".at-controls .at-player-stop");
  playPause.onclick = (e) => {
    if (e.target.classList.contains("disabled")) {
      return;
    }
    api.playPause();
  };
  stop.onclick = (e) => {
    if (e.target.classList.contains("disabled")) {
      return;
    }
    api.stop();
  };
  api.playerReady.on(() => {
    playPause.classList.remove("disabled");
    stop.classList.remove("disabled");
  });
  api.playerStateChanged.on((e) => {
    const icon = playPause.querySelector("i.fas");
    if (e.state === alphaTab.synth.PlayerState.Playing) {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    } else {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  });

  function formatDuration(milliseconds) {
    let seconds = milliseconds / 1000;
    const minutes = (seconds / 60) | 0;
    seconds = (seconds - minutes * 60) | 0;
    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }
  
  const songPosition = wrapper.querySelector(".at-song-position");
  let previousTime = -1;
  api.playerPositionChanged.on((e) => {
    // reduce number of UI updates to second changes.
    const currentSeconds = (e.currentTime / 1000) | 0;
    if (currentSeconds == previousTime) {
      return;
    }
  
    songPosition.innerText =
      formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
  });
}