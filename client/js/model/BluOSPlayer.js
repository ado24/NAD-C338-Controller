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
        if (status) {
            this.title = status.getElementsByTagName('title1')[0].textContent || 'N/A';
            this.artist = status.getElementsByTagName('artist')[0].textContent || 'N/A';
            this.album = status.getElementsByTagName('album')[0].textContent || 'N/A';
            this.image = status.getElementsByTagName('image')[0].textContent || '';
            this.streamFormat = status.getElementsByTagName('streamFormat')[0].textContent || 'N/A';
            this.quality = status.getElementsByTagName('quality')[0].textContent || 'N/A';
            this.volume = status.getElementsByTagName('volume')[0].textContent || '50';
            this.playlistLocation = parseInt(status.getElementsByTagName('song')[0].textContent, 10) || 0;

            if (!this.image.startsWith('http')) {
                this.image = `${this.uri}${this.image}`;
            }
        }

    }

    async play() {
        await this.sendCmd('Play');
    }

    async pause() {
        await this.sendCmd('Pause');
    }

    async skip() {
        await this.sendCmd('Skip');
    }

    async back() {
        await this.sendCmd('Back');
    }

    async stop() {
        await this.sendCmd('Stop');
    }

    async getShuffle() {
        const status = await this.sendCmd('Status');
        if (status) {
            const shuffle = status.getElementsByTagName('shuffle')[0].textContent;
            return shuffle === '1';
        }
        return false;
    }

    async setShuffle(state) {
        await this.sendCmd(`Shuffle?state=${state ? 1 : 0}`);
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
            this.fetchPlaylist().then(playlist => {}).catch(console.error);
        }
        return this._playlist;
    }

    set playlist(playlist) {
        this._playlist = playlist;
    }

    async getPlaylistRange(start, end) {
        const xmlDoc = await this.sendCmd(`Playlist?start=${start}&end=${end}`);
        const tracks = Array.from(xmlDoc.getElementsByTagName('song')).map(song => ({
            id: song.getElementsByTagName('id')[0].textContent,
            title: song.getElementsByTagName('title')[0].textContent,
            artist: song.getElementsByTagName('artist')[0].textContent,
            album: song.getElementsByTagName('album')[0].textContent,
        }));
        this._playlist = tracks;
        return tracks;
    }
}
