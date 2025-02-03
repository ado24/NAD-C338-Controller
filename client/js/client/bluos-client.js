import { BluOSPlayer } from "../model/BluOSPlayer.js";

const bluOsIp = "localhost";
const bluOsPort = 3030;
const updateInterval = 9500;
const volumeIncrement = 2;

/*
    const bluOsHostname = process.env.BLUOS_HOSTNAME;
    const bluOsPort_Env = parseInt(process.env.BLUOS_PORT);
    const updateInterval_Env = parseInt(process.env.POLLING_INTERVAL_MS);
    const volumeIncrement_Env = parseInt(process.env.VOLUME_INCREMENT);
*/

const bluOSPlayer = new BluOSPlayer(bluOsIp, bluOsPort);

const bluOSVolumeSlider = document.getElementById("bluOSVolume");
const bluOSVolumeText = document.getElementById("bluOSVolumeText");
const bluOSVolumeValue = document.getElementById("bluOSVolumeValue");
const bluOsShuffleToggle = document.getElementById("shuffleToggle");

const darkModeToggle = document.getElementById("darkModeToggle")
const bluOsControls = document.getElementById("toggleBluOsControls");
const bluOsPlaylist = document.getElementById("togglePlaylist");
const bluOsPlaylistRefresh = document.getElementById("refreshPlaylist");



let debounceTimeout;

async function updateStatus() {
    try {
        await bluOSPlayer.getStatus();
        document.getElementById('trackTitle').textContent  = `Title: ${bluOSPlayer.title}`;
        document.getElementById('trackArtist').textContent = `Artist: ${bluOSPlayer.artist}`;
        document.getElementById('trackAlbum').textContent  = `Album: ${bluOSPlayer.album}`;
        document.getElementById('trackArt').src = bluOSPlayer.image ? bluOSPlayer.image : 'images/placeholder.png';
        document.getElementById('streamInfo').textContent = `Stream Info: ${bluOSPlayer.streamFormat}`;

        const streamFormat = bluOSPlayer.streamFormat.toUpperCase() || '';
        const quality = bluOSPlayer.quality || '';
        const qualityElement = document.getElementById("qualityType");
        if (quality.includes("mqa")) {
            let mqaLabel = quality.includes("mqaAuthored") ? "MQA Studio" : "MQA";
            qualityElement.innerHTML = `${mqaLabel} <br/><img style="width: 122px; height: 50px;" src="images/mqa-logo.png" alt="MQA Logo" />`;
        } else {
            qualityElement.textContent = streamFormat;
        }

        // Update volume
        const volume = bluOSPlayer.volume || "50";
        bluOSVolumeSlider.value = volume;
        bluOSVolumeText.value = volume;
        bluOSVolumeValue.textContent = volume;

        // Update shuffle toggle
        bluOsShuffleToggle.checked = await bluOSPlayer.getShuffle();

        // Update playlist based on current playing track
        const currentTrackIndex = parseInt(bluOSPlayer.playlistLocation, 10);
        await bluOSPlayer.fetchPlaylist(currentTrackIndex + 1, currentTrackIndex + 11);
        await updatePlaylist();
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

function playTrack() {
    try {
        bluOSPlayer.play().then(r => {}).catch(console.error);
        updateMediaSession();
        navigator.mediaSession.playbackState = "playing";
    } catch (error) {
        console.error("Error playing:", error);
    }
}

function pauseTrack() {
    try {
        bluOSPlayer.pause().then(r => {}).catch(console.error);
        updateMediaSession();
        navigator.mediaSession.playbackState = "paused";
    } catch (error) {
        console.error("Error pausing:", error);
    }
}

function togglePlayPause() {
    if (navigator.mediaSession.playbackState === 'playing') {
        pauseTrack();
    } else {
        playTrack();
    }
}

function skipTrack() {
    try {
        bluOSPlayer.skip().then(r => {}).catch(console.error);
        updateMediaSession();
    } catch (error) {
        console.error("Error skipping:", error);
    }
}

function backTrack() {
    try {
        bluOSPlayer.back().then(r => {}).catch(console.error);
        updateMediaSession();
    } catch (error) {
        console.error("Error going back:", error);
    }
}

function stopTrack() {
    try {
        bluOSPlayer.stop().then(r => {}).catch(console.error);
        updateMediaSession();
        navigator.mediaSession.playbackState = 'none'
    } catch (error) {
        console.error('Error stopping:', error);
    }
}

function increaseVolume(increment= 5) {
    let newVolume = Math.min(parseInt(bluOSVolumeSlider.value) + increment, 100);
    bluOSVolumeSlider.value = newVolume;
    bluOSVolumeText.value = newVolume;
    bluOSVolumeValue.textContent = newVolume;
    bluOSPlayer.setVolume(newVolume).then(r => {}).catch(console.error);
}

function decreaseVolume(increment= 5) {
    let newVolume = Math.max(parseInt(bluOSVolumeSlider.value) - increment, 0);
    bluOSVolumeSlider.value = newVolume;
    bluOSVolumeText.value = newVolume;
    bluOSVolumeValue.textContent = newVolume;
    bluOSPlayer.setVolume(newVolume).then(r => {}).catch(console.error);
}


async function updatePlaylist(playlist) {
    const playlistTracks = document.getElementById('playlistTracks');
    playlistTracks.innerHTML = ''; // Clear existing tracks
    const playlistXmlDoc = playlist || await bluOSPlayer.playlist;
    if (!playlistXmlDoc || typeof playlistXmlDoc.getElementsByTagName !== 'function') {
        console.error('Invalid playlist format');
        return;
    }
    const songs = playlistXmlDoc.getElementsByTagName('song');
    for (let song of songs) {
        const title = song.getElementsByTagName('title')[0].textContent;
        const artist = song.getElementsByTagName('art')[0].textContent;
        const li = document.createElement('li');
        li.textContent = `${title} by ${artist}`;
        playlistTracks.appendChild(li);
    }
}

function updateMediaSession() {
    if ('mediaSession' in navigator) {
        bluOSPlayer.getStatus().then(r => {}).catch(console.error);
        navigator.mediaSession.metadata = new MediaMetadata({
            title:  `Title: ${bluOSPlayer.title}`,
            artist: `Artist: ${bluOSPlayer.artist}`,
            album:  `Album: ${bluOSPlayer.album}`,
            artwork: [
                {src: bluOSPlayer.image, sizes: '96x96',   type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '128x128', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '192x192', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '256x256', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '384x384', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '512x512', type: 'image/jpeg'},
            ]
        });

        navigator.mediaSession.setActionHandler('play', playTrack);
        navigator.mediaSession.setActionHandler('pause', pauseTrack);
        navigator.mediaSession.setActionHandler('previoustrack', backTrack);
        navigator.mediaSession.setActionHandler('nexttrack', skipTrack);
        navigator.mediaSession.setActionHandler('stop', stopTrack);
    }
}

// Event Listeners

document.getElementById('play').addEventListener('click', playTrack);
document.getElementById('pause').addEventListener('click', pauseTrack);
document.getElementById('skip').addEventListener('click', skipTrack);
document.getElementById('back').addEventListener('click', backTrack);
document.getElementById('stop').addEventListener('click', stopTrack);
document.getElementById('getStatus').addEventListener('click', updateStatus);

document.getElementById('getSyncStatus').addEventListener('click', () => bluOSPlayer.sendCmd('SyncStatus'));
document.getElementById('reboot').addEventListener('click', () => bluOSPlayer.reboot());

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

bluOSVolumeSlider.addEventListener('input', () => {
    bluOSVolumeValue.textContent = bluOSVolumeSlider.value;
    bluOSVolumeText.value = bluOSVolumeSlider.value;
    bluOSPlayer.setVolume(bluOSVolumeSlider.value);
});
bluOSVolumeText.addEventListener('input', () => {
    bluOSVolumeSlider.value = bluOSVolumeText.value;
    bluOSVolumeValue.textContent = bluOSVolumeText.value;
    bluOSPlayer.setVolume(bluOSVolumeText.value);
});
bluOsControls.addEventListener('click', () => {
    const bluOsControls = document.getElementById('bluOs-control-group');
    bluOsControls.style.display = bluOsControls.style.display === 'none' ? 'block' : 'none';
});

bluOsPlaylist.addEventListener('click', async () => {
    const playlist = document.getElementById('playlist');
    if (playlist.style.display === 'none') {
        const currentTrackIndex = parseInt(bluOSPlayer.playlistLocation, 10);
        const playlistXmlDoc = await bluOSPlayer.fetchPlaylist(currentTrackIndex + 1, currentTrackIndex + 11)
        if (playlistXmlDoc) {
            await updatePlaylist(playlistXmlDoc);
        }
        playlist.style.display = 'block';
        document.getElementById('togglePlaylist').textContent = 'Hide Playlist';
    } else {
        playlist.style.display = 'none';
        document.getElementById('togglePlaylist').textContent = 'Show Playlist';
    }
});

bluOsPlaylistRefresh.addEventListener('click', async () => {
    const currentTrackIndex = parseInt(bluOSPlayer.playlistLocation, 10);
    await updatePlaylist(await bluOSPlayer.fetchPlaylist(currentTrackIndex + 1, currentTrackIndex + 11));
});

bluOsShuffleToggle.addEventListener('change', () => {
    bluOSPlayer.setShuffle(bluOsShuffleToggle.checked).then(r => {}).catch(console.error);
});


document.addEventListener('keydown', (event) => {

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        switch (event.key) {
            case 'MediaPlayPause':
                togglePlayPause();
                break;
            case 'MediaTrackNext':
                skipTrack();
                break;
            case 'MediaTrackPrevious':
                backTrack();
                break;
            case 'MediaStop':
                stopTrack();
                break;
            case 'AudioVolumeDown':
                decreaseVolume(volumeIncrement);
                break;
            case 'AudioVolumeUp':
                increaseVolume(volumeIncrement);
                break;
            default:
                break;
        }
    }, 200); // Adjust the debounce delay as needed
});

// Initial update
updateMediaSession();
// Poll every 10 seconds
setInterval(updateStatus, updateInterval);

navigator.mediaSession.setActionHandler('play', playTrack);
navigator.mediaSession.setActionHandler('pause', pauseTrack);
navigator.mediaSession.setActionHandler('previoustrack', backTrack);
navigator.mediaSession.setActionHandler('nexttrack', skipTrack);
navigator.mediaSession.setActionHandler('stop', stopTrack);

