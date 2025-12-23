export class IAudioPlayer {
    constructor(ip, port, protocol = "http") {
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

    getStorageKey() {
        throw new Error("Method 'getStorageKey()' must be implemented.");
    }

    serialize() {
        const properties = Object.keys(this);
        const state = {};
        properties.forEach(prop => {
            state[prop] = this[prop];
        });
        return JSON.stringify(state);
    }

    static deserialize(json, instance) {
        const data = JSON.parse(json);
        Object.keys(data).forEach(key => {
            instance[key] = data[key];
        });
        return instance;
    }

    saveStateToLocalStorage() {
        const state = this.serialize();
        localStorage.setItem(player.getStorageKey(), state);
    }

    restoreStateFromLocalStorage() {
        const state = localStorage.getItem(this.getStorageKey());
        if (state) {
            IAudioPlayer.deserialize(state, this);
        }
    }
}