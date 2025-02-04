export class IAudioPlayer {
    constructor(ip, port, protocol = "https") {
        if (new.target === IAudioPlayer) {
            throw new TypeError("Cannot construct IAudioPlayer instances directly");
        }
        this.ip = ip;
        this.port = port;
        this.volume = 0;
        this.mute = false;
        this.protocol = protocol;
    }

    async sendCmd(cmd) {
        throw new Error("Method 'sendCmd()' must be implemented.");
    }

    async getVolume() {
        return this.volume;
    }

    async setVolume(level) {
        throw new Error("Method 'setVolume()' must be implemented.");
    }

    async getEndpoint() {
        return `${this.protocol}://${this.ip}:${this.port}`;
    }
}