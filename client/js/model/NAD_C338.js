import { AudioPlayer } from "./interface/AudioPlayer.js";

export class NAD_C338 extends AudioPlayer {
    constructor(ip, port = 30001, protocol = "http", localServerEndpoint = "https://10.0.0.4:3000") {
        super(ip, port, protocol);
        this.powerState = null;
        this.source = null;
        this.brightness = null;
        this.bassEqualization = null;
        this.autoSense = null;
        this.autoStandby = null;
        this.localServerEndpoint = localServerEndpoint;
    }

    getStorageKey() {
        return 'nadC338State';
    }

    async sendCmd(endpoint, method = 'GET', body = null) {
        try {
            const response = await fetch(`${this.localServerEndpoint}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                },
                body: body ? JSON.stringify(body) : null
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else if (response.headers.get('content-type')?.includes('text/plain')
                && response.headers.get('content-length') === '2') {
                return response.status;
            }
            return await response?.json();
        } catch (error) {
            console.error('Error sending command:', error);
            throw error;
        }
    }

    async powerOn() {
        await this.sendCmd('/power', 'POST', { state: 'On' });
        this.powerState = 'On';
    }

    async powerOff() {
        await this.sendCmd('/power', 'POST', { state: 'Off' });
        this.powerState = 'Off';
    }

    async setVolume(vol) {
        await this.sendCmd('/volume', 'PUT', { level: vol });
        this.volume = vol;
    }

    async setSource(source) {
        await this.sendCmd('/source', 'PUT', { source });
        this.source = source;
    }

    async setMute() {
        await this.sendCmd('/mute', 'POST');
        this.mute = 'On';
    }

    async unMute() {
        await this.sendCmd('/unmute', 'POST');
        this.mute = 'Off';
    }

    async setBrightness(level) {
        await this.sendCmd('/brightness', 'PUT', { level });
        this.brightness = level;
    }

    async setBass() {
        await this.sendCmd('/bass', 'POST');
        this.bassEqualization = 'On';
    }

    async unsetBass() {
        await this.sendCmd('/bass', 'DELETE');
        this.bassEqualization = 'Off';
    }

    async setAutoSense() {
        await this.sendCmd('/auto-sense', 'POST');
        this.autoSense = 'On';
    }

    async unsetAutoSense() {
        await this.sendCmd('/auto-sense', 'DELETE');
        this.autoSense = 'Off';
    }

    async setAutoStandby() {
        await this.sendCmd('/auto-standby', 'POST');
        this.autoStandby = 'On';
    }

    async unsetAutoStandby() {
        await this.sendCmd('/auto-standby', 'DELETE');
        this.autoStandby = 'Off';
    }

    async getPower() {
        const data = await this.sendCmd('/power');
        this.powerState = data.power;
        return this.powerState;
    }

    async getVolume() {
        const data = await this.sendCmd('/volume');
        this.volume = data.volume;
        return this.volume;
    }

    async getSource() {
        const data = await this.sendCmd('/source');
        this.source = data.source;
        return this.source;
    }

    async getMute() {
        const data = await this.sendCmd('/mute');
        this.mute = data.mute;
        return this.mute;
    }

    async getBrightness() {
        const data = await this.sendCmd('/brightness');
        this.brightness = data.brightness;
        return this.brightness;
    }

    async getBass() {
        const data = await this.sendCmd('/bass');
        this.bassEqualization = data.bass;
        return this.bassEqualization;
    }

    async getAutoSense() {
        const data = await this.sendCmd('/auto-sense');
        this.autoSense = data.autoSense;
        return this.autoSense;
    }

    async getAutoStandby() {
        const data = await this.sendCmd('/auto-standby');
        this.autoStandby = data.autoStandby;
        return this.autoStandby;
    }
}