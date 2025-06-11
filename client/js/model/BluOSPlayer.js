import { AudioPlayer } from "./interface/AudioPlayer.js";

export class BluOSPlayer extends AudioPlayer {
    constructor(ip, port = 11000, protocol = "https") {
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
        this.seekLocation = 0;
        this.trackLength = 0;
        this.canSeekTrack = true;
        this.isEditMode = false;
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
        const status = await this.sendCmd('Status');
        try {
            if (status) {
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

                if  (this.image.startsWith('http://resources.tidal.com/images/')) {
                    this.image = this.image.replace('http://resources.tidal.com/images/', 'https://resources.tidal.com/images/');
                } else if (!this.image.startsWith('http')) {
                    this.image = `${this.uri}${this.image}`;
                }
            }
        } catch (e) {
            console.error('Error getting status:', e);
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

    async getShuffle() {
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

    // Getters and setters

    get uri() {
        return `${this.protocol}://${this.ip}:${this.port}`;
    }

    get playlist() {
        if (!this._playlist.length) {
            const currentTrackIndex = parseInt(this.playlistLocation, 10);
            this.fetchPlaylist(currentTrackIndex + 1, currentTrackIndex + 11).then(() => {}).catch(console.error);
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
