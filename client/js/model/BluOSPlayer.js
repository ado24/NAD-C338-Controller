import {AudioPlayer} from "./interface/AudioPlayer.js";

export class BluOSPlayer extends AudioPlayer {
    constructor(ip, port = 11000, protocol = "https", pollingInterval = 15, playlistWindow = 10) {
        super(ip, port, protocol);
        this.title = null;
        this.artist = null;
        this.album = null;
        this.image = null;
        this.streamFormat = null;
        this.quality = null;
        this.shuffle = false;
        this._playlist = [];
        this.playlistLocation = 0;
        this.playlistWindow = playlistWindow;
        this.seekLocation = 0;
        this.trackLength = 0;
        this.canSeekTrack = true;
        this.isEditMode = false;
        //Long polling variables
        this.lastEtag = this.restoreEtagFromStorage();
        this.isPolling = false;
        this.minPollInterval = pollingInterval; // defaults to 15 second minimum between polls
        this.lastPollTime = 0;
        this.consecutiveEmptyResponses = 0;
        this.maxConsecutiveEmptyResponses = 3;
    }

    getEtagStorageKey() {
        return `bluOSPlayer_${this.ip}_etag`;
    }

    restoreEtagFromStorage() {
        try {
            return localStorage.getItem(this.getEtagStorageKey()) || null;
        } catch (e) {
            console.warn('Could not restore etag from storage:', e);
            return null;
        }
    }

    saveEtagToStorage(etag) {
        try {
            if (etag) {
                localStorage.setItem(this.getEtagStorageKey(), etag);
            }
        } catch (e) {
            console.warn('Could not save etag to storage:', e);
        }
    }

    clearEtagStorage() {
        try {
            localStorage.removeItem(this.getEtagStorageKey());
            this.lastEtag = null;
            this.consecutiveEmptyResponses = 0;
        } catch (e) {
            console.warn('Could not clear etag from storage:', e);
        }
    }

    getStorageKey() {
        return 'bluOSPlayerState';
    }

    async sendCmd(cmd) {
        try {
            const response = await fetch(`${this.protocol}://${this.ip}:${this.port}/${cmd}`);
            const textResponse = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(textResponse, "application/xml");
        } catch (error) {
            console.error('Error sending command:', error);
            throw error;
        }
    }

    async getStatus() {
        const now = Date.now();
        const timeSinceLastPoll = now - this.lastPollTime;

        if (this.isPolling && timeSinceLastPoll < this.minPollInterval) {
            return; // Prevent polling too frequently
        }

        this.lastPollTime = now;
        this.isPolling = true;

        try {
            const endpoint = this.lastEtag
                ? `Status?timeout=${this.minPollInterval}&etag=${this.lastEtag}`
                : 'Status';

            const status = await this.sendCmd(endpoint);
            if (status) {
                const newEtag = status.documentElement.getAttribute('etag');

                // Check if we have document content (not a 304 Not Modified equivalent)
                const hasContent = status.getElementsByTagName('title1')[0] !== undefined;

                if (hasContent) {
                    // Reset counter on successful content retrieval
                    this.consecutiveEmptyResponses = 0;

                    this.title = status.getElementsByTagName('title1')[0]?.textContent || 'N/A';
                    this.artist = status.getElementsByTagName('artist')[0]?.textContent || 'N/A';
                    this.album = status.getElementsByTagName('album')[0]?.textContent || 'N/A';
                    this.image = status.getElementsByTagName('image')[0]?.textContent || '';
                    this.volume = status.getElementsByTagName('volume')[0]?.textContent || '50';
                    this.mute = status.getElementsByTagName('mute')[0]?.textContent === '1';
                    this.shuffle = status.getElementsByTagName('shuffle')[0]?.textContent === '1';
                    this.playlistLocation = parseInt(status.getElementsByTagName('song')[0]?.textContent, 10) || 0;
                    this.seekLocation = parseInt(status.getElementsByTagName('secs')[0]?.textContent) || 0;
                    this.canSeekTrack = parseInt(status.getElementsByTagName('canSeek')[0]?.textContent) === 1;
                    this.trackLength = parseInt(status.getElementsByTagName('totlen')[0]?.textContent) || 0;
                    this.playState = status.getElementsByTagName('state')[0]?.textContent || 'none';
                    this.playState = this.isPlaying() ? 'playing' : 'paused';
                    this.streamFormat = status.getElementsByTagName('streamFormat')[0]?.textContent || 'N/A';
                    this.quality = status.getElementsByTagName('quality')[0]?.textContent || 'N/A';

                    if (this.image.startsWith('http://resources.tidal.com/images/')) {
                        this.image = this.image.replace('http://resources.tidal.com/images/', 'https://resources.tidal.com/images/');
                    } else if (!this.image.startsWith('http')) {
                        this.image = `${this.uri}${this.image}`;
                    }
                } else {
                    // Empty response (likely 304 Not Modified equivalent)
                    this.consecutiveEmptyResponses++;
                    console.debug(`Received empty status response (${this.consecutiveEmptyResponses}/${this.maxConsecutiveEmptyResponses})`);

                    // If we get too many consecutive empty responses, reset the etag to prevent stalling
                    if (this.consecutiveEmptyResponses >= this.maxConsecutiveEmptyResponses) {
                        console.warn('Too many consecutive empty responses; resetting etag to recover from stale state');
                        this.clearEtagStorage();
                    }
                }

                // Store new etag for next poll (even if response was empty, etag may have changed)
                if (newEtag) {
                    this.lastEtag = newEtag;
                    this.saveEtagToStorage(newEtag);
                }
            }
        } catch (e) {
            console.error('Error getting status:', e);
            // On network errors, reset etag to allow recovery on next poll
            this.clearEtagStorage();
        } finally {
            this.isPolling = false;
        }

    }

    async play(id= -1) {
        if (id >= 0) {
            await this.sendCmd(`Play?id=${id}`);
        } else {
            await this.sendCmd('Play');
        }
    }

    async pause() {
        await this.sendCmd('Pause?toggle=1');
    }

    async skip() {
        await this.sendCmd('Skip').then(() => {
            this.getStatus();
        });
    }

    async back() {
        await this.sendCmd('Back').then(() => {
            this.getStatus();
        });
    }

    async stop() {
        await this.sendCmd('Stop');
    }

    async mute() {
        await this.sendCmd('Mute?state=1');
    }

    async seek(position) {
        await this.sendCmd(`Play?seek=${position}`);
        this.seekLocation = position;
    }

    async getShuffle(useState = true) {
        if (useState) {
            return this.shuffle;
        }

        const status = await this.sendCmd('Status');
        if (status) {
            const shuffle = status.getElementsByTagName('shuffle')[0]?.textContent;
            return shuffle === '1';
        }
        return false;
    }

    async setShuffle(state) {
        await this.sendCmd(`Shuffle?state=${state ? 1 : 0}`).then(() => {
            this.getStatus();
        });
    }

    async setVolume(level) {
        await this.sendCmd(`Volume?level=${level}`);
        this.volume = level;
    }

    async reboot() {
        await this.sendCmd('reboot');
    }

    async fetchPlaylist(start=1, end=10) {
        this._playlist = await this.sendCmd(`Playlist?start=${start}&end=${end}`);
        return this._playlist;
    }

    async fetchPlaylistWindow(windowSize = this.playlistWindow){
        await this.fetchPlaylist(this.playlistLocation, this.playlistLocation + windowSize);
    }

    // Getters and setters

    get uri() {
        return `${this.protocol}://${this.ip}:${this.port}`;
    }

    get playlist() {
        if (!this._playlist.length) {
            const currentTrackIndex = parseInt(this.playlistLocation, 10);
            this.fetchPlaylist(currentTrackIndex + 1, currentTrackIndex + this.playlistWindow).then(() => {}).catch(console.error);
        }
        return this._playlist;
    }

    set playlist(playlist) {
        this._playlist = playlist;
    }

    async getPlaylistRange(start, end) {
        const xmlDoc = await this.sendCmd(`Playlist?start=${start}&end=${end}`);
        const tracks = Array.from(xmlDoc.getElementsByTagName('song')).map(song => ({
            id: song.getElementsByTagName('id')[0]?.textContent,
            title: song.getElementsByTagName('title')[0]?.textContent,
            artist: song.getElementsByTagName('artist')[0]?.textContent,
            album: song.getElementsByTagName('album')[0]?.textContent,
        }));
        this._playlist = tracks;
        return tracks;
    }

    async deleteTrack(id) {
        const response = await this.sendCmd(`Delete?id=${id}`);
        const deletedId = response.getElementsByTagName('deleted')[0]?.textContent;
        if (!deletedId) {
            throw new Error('Failed to delete track');
        }
        return parseInt(deletedId, 10);
    }

    async moveTrack(oldPosition, newPosition) {
        const response = await this.sendCmd(`Move?old=${oldPosition}&new=${newPosition}`);
        const result = response.getElementsByTagName('moved')[0]?.textContent;
        if (result !== 'moved') {
            throw new Error('Failed to move track');
        }
        return true;
    }
}
