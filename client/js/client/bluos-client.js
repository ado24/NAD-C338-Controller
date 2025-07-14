import { BluOSPlayer } from "../model/BluOSPlayer.js";

const bluOsIp = "10.0.0.4";
const bluOsPort = 3030;
const blusOsUpdateInterval = 35; // Update interval for BluOS player status
const updateInterval = 35000;
const seekUpdateInterval = 1000;
const volumeIncrement = 2;

const bluOSPlayer = new BluOSPlayer(bluOsIp, bluOsPort, "https", blusOsUpdateInterval);

// Create a dummy audio element
const dummyAudio = new Audio();
dummyAudio.src = 'data:audio/wav;base64,UklGRvQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
dummyAudio.loop = true;

// Set attributes for better mobile support
dummyAudio.setAttribute('playsinline', '');
dummyAudio.setAttribute('webkit-playsinline', '');

const bluOSVolumeSlider = document.getElementById("bluOSVolume");
const bluOSVolumeText = document.getElementById("bluOSVolumeText");
const bluOSVolumeValue = document.getElementById("bluOSVolumeValue");
const bluOsShuffleToggle = document.getElementById("shuffleToggle");

const darkModeToggle = document.getElementById("darkModeToggle")
const bluOsControls = document.getElementById("toggleBluOsControls");
const bluOsPlaylist = document.getElementById("togglePlaylist");
const bluOsPlaylistRefresh = document.getElementById("refreshPlaylist");
const bluOsPlaylistEdit = document.getElementById("editPlaylist");

const seekSlider = document.getElementById('seek');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');

const stripToggle = document.getElementById('control-strip-toggle');
const controlStrip = document.getElementById('control-strip');
const stripButtons = document.querySelector('.control-strip-buttons');
const stripVolume = document.querySelector('.control-strip-volume');
const stripVolumeSlider = document.getElementById('strip-volume');
const stripVolumeValue = document.getElementById('strip-volume-value');
const stripPlay = document.getElementById('strip-play');

const stripTrackInfo = document.getElementById('strip-title');
const stripToggleVolume = document.getElementById('strip-toggle-volume');
const stripToggleSeek = document.getElementById('strip-toggle-seek');
const stripSeek = document.querySelector('.control-strip-seek');
const stripSeekSlider = document.getElementById('strip-seek');
const stripCurrentTime = document.getElementById('strip-current-time');
const stripTotalTime = document.getElementById('strip-total-time');

let debounceTimeout;
let seekInterval;
let isEditMode = false;
let draggedItem = null;

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

        bluOsShuffleToggle.checked = await bluOSPlayer.getShuffle(true);

        await updatePlaylist();

        const fullTitle = `${bluOSPlayer.title} - ${bluOSPlayer.artist}`
        const trackInfoContainer = document.getElementById('control-strip-info-container');
        stripTrackInfo.textContent = fullTitle;
        stripTrackInfo.dataset.text = fullTitle;
        trackInfoContainer.dataset.text = fullTitle;

        stripVolumeSlider.value = bluOSPlayer.volume;
        stripVolumeValue.textContent = bluOSPlayer.volume;

        // Update play button icon
        stripPlay.querySelector('i').classList.remove('fa-play', 'fa-pause');
        stripPlay.querySelector('i').classList.add(
            bluOSPlayer.isPlaying() ? 'fa-pause' : 'fa-play'
        );

        // Update seek slider in control strip
        stripSeekSlider.max = bluOSPlayer.trackLength;
        stripSeekSlider.value = bluOSPlayer.seekLocation;
        stripSeekSlider.disabled = !bluOSPlayer.canSeekTrack;
        stripCurrentTime.textContent = formatTime(bluOSPlayer.seekLocation);
        stripTotalTime.textContent = formatTime(bluOSPlayer.trackLength);


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
            .then(() => stopSeekInterval())
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
            .then(() => stopSeekInterval())
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
            .then(() => stopSeekInterval())
            .then(() => updateStatus())
            .then(() => updatePlaylist())
            .catch(console.error);
        updateMediaSession(true);
    } catch (error) {
        console.error("Error skipping:", error);
    }
}

function backTrack() {
    try {
        bluOSPlayer.back()
            .then(() => stopSeekInterval())
            .then(() => updateStatus())
            .catch(console.error);
        updateMediaSession(true);
    } catch (error) {
        console.error("Error going back:", error);
    }
}

function changeVolumeElements(newVolume, updateModel = false) {
    bluOSVolumeSlider.value = newVolume;
    bluOSVolumeText.value = newVolume;
    bluOSVolumeValue.textContent = newVolume;

    stripVolumeValue.textContent = newVolume;
    stripVolumeValue.value = newVolume
    stripVolumeSlider.value = newVolume;

    if (updateModel)
        bluOSPlayer.setVolume(newVolume).then(() => {}).catch(console.error);
}

function increaseVolume(increment = 5) {
    let newVolume = Math.min(parseInt(bluOSVolumeSlider.value) + increment, 100);
    changeVolumeElements(newVolume, true);
}

function decreaseVolume(increment = 5) {
    let newVolume = Math.max(parseInt(bluOSVolumeSlider.value) - increment, 0);
    changeVolumeElements(newVolume, true);
}

function enableDragAndDrop(element) {
    element.draggable = true;
    element.classList.add('draggable');
}

function disableDragAndDrop(element) {
    element.draggable = false;
    element.classList.remove('draggable');
}

function handleDragStart(e) {
    if (!isEditMode) return;
    draggedItem = e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    if (!isEditMode) return;
    e.preventDefault();
}

function handleTouchStart(e) {
    if (!isEditMode) return;
    draggedItem = e.target.closest('.playlist-item');
    draggedItem.classList.add('dragging');
    e.target.style.opacity = '0.5';
}

function handleTouchMove(e) {
    if (!isEditMode) return;
    e.preventDefault();
    const touch = e.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const dropTarget = elements.find(el => el.classList.contains('playlist-item'));

    if (dropTarget && dropTarget !== draggedItem) {
        dropTarget.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    if (!isEditMode) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const dropTarget = elements.find(el => el.classList.contains('playlist-item'));

    if (dropTarget && draggedItem) {
        const oldIndex = draggedItem.getAttribute('data-index');
        const newIndex = dropTarget.getAttribute('data-index');

        bluOSPlayer.moveTrack(oldIndex, newIndex)
            .then(() => refreshPlaylist())
            .catch(error => console.error('Error moving track:', error));
    }

    draggedItem.style.opacity = '1';
    draggedItem.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedItem = null;
}

async function handleDrop(e) {
    if (!isEditMode) return;
    e.preventDefault();

    const dropTarget = e.target.closest('.playlist-item');
    if (!dropTarget || !draggedItem) return;

    const oldIndex = draggedItem.getAttribute('data-index');
    const newIndex = dropTarget.getAttribute('data-index');

    try {
        await bluOSPlayer.moveTrack(oldIndex, newIndex);
        await refreshPlaylist();
    } catch (error) {
        console.error('Error moving track:', error);
    }
}

function handleDragEnd(e) {
    if (!isEditMode) return;
    e.target.classList.remove('dragging');
    draggedItem = null;
}

function togglePlaylistEditMode() {
    isEditMode = !isEditMode;
    const playlistItems = document.querySelectorAll('.playlist-item');
    document.querySelectorAll('.delete-track');
    playlistItems.forEach((item) => {
        if (isEditMode) {
            enableDragAndDrop(item);
            item.querySelector('.delete-track').style.display = 'inline';
        } else {
            disableDragAndDrop(item);
            item.querySelector('.delete-track').style.display = 'none';
        }
    });

    document.getElementById('editPlaylist').classList.toggle('active');
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
        const songId = song.getAttribute('id');

        const listItem = document.createElement('div');
        listItem.className = 'playlist-item';
        listItem.setAttribute('data-index', songId); // Using actual song ID
        listItem.setAttribute('draggable', 'true');

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'playlist-content';

        // Add track number
        const trackNum = document.createElement('span');
        trackNum.className = 'track-number';
        trackNum.textContent = `${index + 1}. `;

        // Add title
        const titleSpan = document.createElement('span');
        titleSpan.className = 'track-title';
        titleSpan.textContent = song.getElementsByTagName('title')[0]?.textContent || 'Unknown';

        // Add artist
        const artistSpan = document.createElement('span');
        artistSpan.className = 'track-artist';
        artistSpan.textContent = ' by ' + song.getElementsByTagName('art')[0]?.textContent || '';

        contentDiv.appendChild(trackNum);
        contentDiv.appendChild(titleSpan);
        contentDiv.appendChild(artistSpan);

        // Add delete button (hidden by default)
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-track';
        deleteButton.style.display = 'none';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.onclick = async (e) => {
            e.stopPropagation();
            try {
                await bluOSPlayer.deleteTrack(songId);
                await refreshPlaylist();
            } catch (error) {
                console.error('Error deleting track:', error);
            }
        };

        listItem.appendChild(contentDiv);
        listItem.appendChild(deleteButton);

        // Add click handler for playing tracks
        listItem.onclick = () => bluOSPlayer.play(songId);

        // Add drag and drop handlers when in edit mode
        listItem.addEventListener('dragstart', handleDragStart);
        listItem.addEventListener('dragover', handleDragOver);
        listItem.addEventListener('drop', handleDrop);
        listItem.addEventListener('dragend', handleDragEnd);

        // Inside updatePlaylist function, where you add other event listeners
        listItem.addEventListener('touchstart', handleTouchStart, { passive: false });
        listItem.addEventListener('touchmove', handleTouchMove, { passive: false });
        listItem.addEventListener('touchend', handleTouchEnd);


        playlistTracks.appendChild(listItem);
    });

    // Update drag states based on edit mode
    updatePlaylistEditState();
}

function updatePlaylistEditState() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        if (isEditMode) {
            item.draggable = true;
            item.classList.add('draggable');
            item.querySelector('.delete-track').style.display = 'inline';
        } else {
            item.draggable = false;
            item.classList.remove('draggable');
            item.querySelector('.delete-track').style.display = 'none';
        }
    });
}

async function refreshPlaylist() {
    const currentTrackIndex = parseInt(bluOSPlayer.playlistLocation, 10);
    const playlistXmlDoc = await bluOSPlayer.fetchPlaylist(currentTrackIndex + 1, currentTrackIndex + 11);
    if (playlistXmlDoc) {
        await updatePlaylist(playlistXmlDoc);
    }
}

async function updateSeekSlider(updateAllSliders = true) {
    const currentTime = bluOSPlayer.seekLocation;
    const totalTime = bluOSPlayer.trackLength;
    const canSeek = bluOSPlayer.canSeekTrack;

    seekSlider.max = totalTime;
    seekSlider.value = currentTime;
    seekSlider.disabled = !canSeek;

    currentTimeSpan.textContent = formatTime(currentTime);
    totalTimeSpan.textContent = formatTime(totalTime);
    dummyAudio.currentTime = currentTime;
    if (updateAllSliders)
        stripCurrentTime.textContent = formatTime(currentTime);
}

function startSeekInterval() {
    clearInterval(seekInterval);
    seekInterval = setInterval(async () => {
        bluOSPlayer.seekLocation += 1;
        updateSeekSlider().then(() => {
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
            bluOSPlayer.getStatus().then(() => {}).catch(console.error);
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

// Add control strip button listeners
document.getElementById('strip-play').addEventListener('click', togglePlayPause);
document.getElementById('strip-back').addEventListener('click', backTrack);
document.getElementById('strip-skip').addEventListener('click', skipTrack);

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

bluOsPlaylistEdit.addEventListener('click', togglePlaylistEditMode);

bluOsShuffleToggle.addEventListener('change', () => {
    bluOSPlayer.setShuffle(bluOsShuffleToggle.checked).then(() => {}).catch(console.error);
});

seekSlider.addEventListener('input', async (event) => {
    const seekTime = event.target.value;
    try {
        await bluOSPlayer.seek(seekTime);
    } catch (error) {
        console.error('Error seeking track:', error);
    }
});

// Toggle between volume and playback controls
stripToggleSeek.addEventListener('click', () => {
    stripButtons.classList.toggle('hidden');
    stripVolume.classList.toggle('active');
    stripToggleSeek.querySelector('i').classList.toggle('fa-volume-up');
    stripToggleSeek.querySelector('i').classList.toggle('fa-music');
});

// Sync volume controls
stripVolumeSlider.addEventListener('input', () => {
    const value = stripVolumeSlider.value;
    stripVolumeValue.textContent = value;
    changeVolumeElements(value, true);
});

stripToggleVolume.addEventListener('click', () => {
    const isVolumeActive = stripVolume.classList.contains('active');

    // Reset all controls first
    stripVolume.classList.remove('active');
    stripSeek.classList.remove('active');
    stripButtons.classList.remove('hidden');
    stripToggleSeek.hidden = stripToggleSeek.hidden ? true : false;

    if (!isVolumeActive) {
        // Show volume controls only
        stripVolume.classList.add('active');
        stripButtons.classList.add('hidden');
    }

    // Update icons
    stripToggleVolume.querySelector('i').classList.toggle('fa-volume-up');
    stripToggleVolume.querySelector('i').classList.toggle('fa-music');
    stripToggleSeek.querySelector('i').className = 'fas fa-clock';
});

stripToggleSeek.addEventListener('click', () => {
    const isSeekActive = stripSeek.classList.contains('active');

    // Reset all controls first
    stripVolume.classList.remove('active');
    stripSeek.classList.remove('active');
    stripButtons.classList.remove('hidden');
    stripToggleVolume.hidden = stripToggleVolume.hidden ? false : true;

    if (!isSeekActive) {
        // Show seek controls only
        stripSeek.classList.add('active');
        stripButtons.classList.add('hidden');
    }

    // Update icons
    stripToggleSeek.querySelector('i').classList.toggle('fa-clock');
    stripToggleSeek.querySelector('i').classList.toggle('fa-music');
    stripToggleVolume.querySelector('i').className = 'fas fa-volume-up';
});

// Add volume display update
stripVolumeSlider.addEventListener('input', () => {
    const value = stripVolumeSlider.value;
    stripVolumeValue.textContent = value;
    bluOSVolumeSlider.value = value;
    bluOSVolumeText.value = value;
    bluOSPlayer.setVolume(value);
});

// Add continuous seek update
stripSeekSlider.addEventListener('input', (event) => {
    const seekTime = parseInt(event.target.value);
    stripCurrentTime.textContent = formatTime(seekTime);
});

// Add seek completion handler
stripSeekSlider.addEventListener('change', async (event) => {
    const seekTime = parseInt(event.target.value);
    try {
        await bluOSPlayer.seek(seekTime);
        dummyAudio.currentTime = seekTime;
        await updateSeekSlider();
    } catch (error) {
        console.error('Error seeking track:', error);
    }
});

stripToggle.addEventListener('click', () => controlStrip.style.visibility = controlStrip.style.visibility.length === 0 ? 'hidden' : '' ) ;

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

updateMediaSession(false, true);
updatePlaybackState(bluOSPlayer.playState);
setInterval(updateStatus, updateInterval, false);
// Initial status update
await updateStatus(true).then(() => {
    updateMediaSession(true, false);
}).catch(console.error);