import {IAudioPlayer} from "./IAudioPlayer.js";

export class AudioPlayer extends IAudioPlayer {
    constructor(ip, port) {
        super(ip, port);
        this.volume = 0;
    }

    async sendCmd(cmd) {
        try {
            const endpoint = await this.getEndpoint();
            const response = await fetch(`${endpoint}/${cmd}`);
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "application/xml");
            return xmlDoc;
        } catch (error) {
            console.error('Error sending command:', error);
            throw error;
        }
    }

    async setVolume(level) {
        await this.sendCmd(`Volume?level=${level}`);
        this.volume = level;
    }
}