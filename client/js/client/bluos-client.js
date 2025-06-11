import { BluOSPlayer } from "../model/BluOSPlayer.js";

const bluOsIp = "10.0.0.4";
const bluOsPort = 3030;
const updateInterval = 3000;
const seekUpdateInterval = 1000;
const volumeIncrement = 2;

const bluOSPlayer = new BluOSPlayer(bluOsIp, bluOsPort);

// Create a dummy audio element
const dummyAudio = new Audio();
dummyAudio.src = 'data:audio/wav;base64,UklGRvQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
dummyAudio.loop = true;

const bluOSVolumeSlider = document.getElementById("bluOSVolume");
const bluOSVolumeText = document.getElementById("bluOSVolumeText");
const bluOSVolumeValue = document.getElementById("bluOSVolumeValue");
const bluOsShuffleToggle = document.getElementById("shuffleToggle");

const darkModeToggle = document.getElementById("darkModeToggle")
const bluOsControls = document.getElementById("toggleBluOsControls");
const bluOsPlaylist = document.getElementById("togglePlaylist");
const bluOsPlaylistRefresh = document.getElementById("refreshPlaylist");

const seekSlider = document.getElementById('seek');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');

let debounceTimeout;
let seekInterval;

async function updateStatus(shouldUpdateMediaSession = true) {
    try {
        await bluOSPlayer.getStatus().then(
            () => {
                if (!bluOSPlayer.isPlaying()) {
                    stopSeekInterval();
                    dummyAudio.pause();
                } else {
                    startSeekInterval();
                    dummyAudio.play();
                }
            }
        ).then(
            () => updateSeekSlider()
        ).then(
            () => {
                if (shouldUpdateMediaSession)
                    updateMediaSession(false);
            }
        );

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
            qualityElement.innerHTML = `${mqaLabel}`;
            document.getElementById("mqaLabel").style.display = "block";
        } else {
            document.getElementById("mqaLabel").style.display = "none";
            qualityElement.textContent = streamFormat;
        }

        const volume = bluOSPlayer.volume || "50";
        bluOSVolumeSlider.value = volume;
        bluOSVolumeText.value = volume;
        bluOSVolumeValue.textContent = volume;

        bluOsShuffleToggle.checked = await bluOSPlayer.getShuffle();

        await updatePlaylist();
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

function playTrack() {
    try {
        bluOSPlayer.play()
            .then(() => dummyAudio.play())
            .then(() => updateStatus())
            .then(() => updatePlaybackState("playing"))
            .catch(console.error);
    } catch (error) {
        console.error("Error playing:", error);
    }
}

function pauseTrack() {
    try {
        bluOSPlayer.pause()
            .then(() => dummyAudio.pause())
            .then(r => stopSeekInterval())
            .then(() => updateStatus())
            .then(() => updatePlaybackState("paused"))
            .catch(console.error);
    } catch (error) {
        console.error("Error pausing:", error);
    }
}

function stopTrack() {
    try {

        bluOSPlayer.stop()
            .then(r => stopSeekInterval())
            .then(() => updateStatus())
            .then(() => updatePlaybackState('none'))
            .then(() => {
                dummyAudio.pause();
                dummyAudio.currentTime = 0;
            })
            .catch(console.error);
    } catch (error) {
        console.error('Error stopping:', error);
    }
}

function togglePlayPause() {
    if (bluOSPlayer.isPlaying()) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function skipTrack() {
    try {
        bluOSPlayer.skip()
            .then(r => stopSeekInterval())
            .then(() => updateStatus())
            .then(() => updatePlaylist())
            .catch(console.error);
        updateMediaSession();
    } catch (error) {
        console.error("Error skipping:", error);
    }
}

function backTrack() {
    try {
        bluOSPlayer.back()
            .then(r => stopSeekInterval())
            .then(() => updateStatus())
            .catch(console.error);
        updateMediaSession();
    } catch (error) {
        console.error("Error going back:", error);
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
    playlistTracks.innerHTML = '';

    const playlistXmlDoc = playlist || await bluOSPlayer.playlist;
    if (!playlistXmlDoc) {
        console.log('No playlist to update');
        return;
    } else if (playlistXmlDoc.length === 0) {
        console.log('Empty playlist');
        return;
    }
    else if (typeof playlistXmlDoc.getElementsByTagName !== 'function') {
        console.error('Invalid playlist format');
        return;
    }

    const songs = playlistXmlDoc.getElementsByTagName('song');
    Array.from(songs).forEach((song, index) => {
        const title = song.getElementsByTagName('title')[0].textContent;
        const artist = song.getElementsByTagName('art')[0].textContent;
        const songId = song.getAttribute('id')?.toString();

        const li = document.createElement('li');
        const link = document.createElement('a');
        li.className = 'playlist-item';
        link.className = 'playlist-link';
        link.href = '#';
        link.textContent = `${title} by ${artist}`;
        link.dataset.index = songId || index;

        link.addEventListener('click', async (e) => {
            e.preventDefault();
            await bluOSPlayer.play(songId);
            await updateStatus();
        });

        li.appendChild(link);
        playlistTracks.appendChild(li);
    });
}

async function updateSeekSlider() {
    const currentTime = bluOSPlayer.seekLocation;
    const totalTime = bluOSPlayer.trackLength;
    const canSeek = bluOSPlayer.canSeekTrack;

    seekSlider.max = totalTime;
    seekSlider.value = currentTime;
    seekSlider.disabled = !canSeek;

    currentTimeSpan.textContent = formatTime(currentTime);
    totalTimeSpan.textContent = formatTime(totalTime);
    dummyAudio.currentTime = currentTime;
}

function startSeekInterval() {
    clearInterval(seekInterval);
    seekInterval = setInterval(async () => {
        bluOSPlayer.seekLocation += 1;
        updateSeekSlider().then(r => {
            if (bluOSPlayer.seekLocation >= bluOSPlayer.trackLength) {
                updateStatus();
            }
        });
    }, seekUpdateInterval);
}

function stopSeekInterval() {
    clearInterval(seekInterval);
}

function updateMediaSession(getUpdate= true, setActionHandlers = false) {
    if ('mediaSession' in navigator) {
        if (getUpdate) {
            bluOSPlayer.getStatus().then(r => {
            }).catch(console.error);
        }
        
        navigator.mediaSession.metadata = new MediaMetadata({
            title:  `${bluOSPlayer.title}`,
            artist: `${bluOSPlayer.artist}`,
            album:  `${bluOSPlayer.album}`,
            artwork: [
                {src: bluOSPlayer.image, sizes: '96x96',   type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '128x128', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '192x192', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '256x256', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '384x384', type: 'image/jpeg'},
                {src: bluOSPlayer.image, sizes: '512x512', type: 'image/jpeg'},
            ]
        });

        if (setActionHandlers) {
            navigator.mediaSession.setActionHandler('play', playTrack);
            navigator.mediaSession.setActionHandler('pause', pauseTrack);
            navigator.mediaSession.setActionHandler('previoustrack', backTrack);
            navigator.mediaSession.setActionHandler('nexttrack', skipTrack);
            navigator.mediaSession.setActionHandler('stop', stopTrack);
        }

        // Add inside updateMediaSession() function, before the last closing brace
        if ('setPositionState' in navigator.mediaSession) {
            navigator.mediaSession.setPositionState({
                duration: bluOSPlayer.trackLength,
                playbackRate: 1.0,
                position: bluOSPlayer.seekLocation
            });
        }

        navigator.mediaSession.setActionHandler('seekto', async (details) => {
            const newTime = Math.max(0, Math.min(details.seekTime, bluOSPlayer.trackLength));
            if (details.fastSeek && 'fastSeek' in dummyAudio) {
                dummyAudio.fastSeek(newTime);
            } else {
                dummyAudio.currentTime = newTime;
            }
            await bluOSPlayer.seek(newTime);
            await updateSeekSlider();
        });

        navigator.mediaSession.setActionHandler('seekbackward', async () => {
            const skipTime = 10; // Skip 10 seconds backward
            const newTime = Math.max(0, bluOSPlayer.seekLocation - skipTime);
            await bluOSPlayer.seek(newTime);
            dummyAudio.currentTime = newTime;
            await updateSeekSlider();
        });

        navigator.mediaSession.setActionHandler('seekforward', async () => {
            const skipTime = 10; // Skip 10 seconds forward
            const newTime = Math.min(bluOSPlayer.trackLength, bluOSPlayer.seekLocation + skipTime);
            await bluOSPlayer.seek(newTime);
            dummyAudio.currentTime = newTime;
            currentTimeSpan.textContent = formatTime(newTime);
            await updateSeekSlider();
        });

        updatePlaybackState(bluOSPlayer.playState);
    }
}

function updatePlaybackState(state) {
    if ('mediaSession' in navigator) {
        if (["playing", "paused", "none"].includes(state)) {
            navigator.mediaSession.playbackState = state;
            bluOSPlayer.playState = state;
            /*
            if (["playing", "paused"].includes(state))
                "paused" === state ?
                    dummyAudio.pause() :
                    dummyAudio.play().then(r => { console.error('Could not start dummy audio') });
            */
        } else {
            console.error('Invalid playback state:', state);
        }
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

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

seekSlider.addEventListener('input', async (event) => {
    const seekTime = event.target.value;
    try {
        await bluOSPlayer.seek(seekTime);
    } catch (error) {
        console.error('Error seeking track:', error);
    }
});

document.addEventListener('keydown', (event) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        switch (event.key) {
/*            case 'MediaPlayPause':
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
*/
            case 'AudioVolumeDown':
                decreaseVolume(volumeIncrement);
                break;
            case 'AudioVolumeUp':
                increaseVolume(volumeIncrement);
                break;
            default:
                break;
        }
    }, 200);
});

updateMediaSession(true, true);
updatePlaybackState(bluOSPlayer.playState);
setInterval(updateStatus, updateInterval);
