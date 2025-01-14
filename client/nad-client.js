const nadPollingInterval = 10000;

class NADC338 {
    constructor(ip, port = 30001) {
        this.ip = ip;
        this.port = port;
        this.powerState = null;
        this.volume = null;
        this.source = null;
        this.mute = null;
        this.brightness = null;
        this.bassEqualization = null;
        this.autoSense = null;
        this.autoStandby = null;
    }

    async sendCmd(cmd, readReply = false) {
        try {
            const response = await fetch(`http://localhost:30001/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ip: this.ip, port: this.port, cmd})
            });
            if (readReply) {
                const text = await response.text();
                return text.split('=')[1].trim();
            }
            return null;
        } catch (error) {
            console.error('Error sending command:', error);
            throw error;
        }
    }

    async powerOn() {
        await this.sendCmd('Main.Power=On', true);
        this.powerState = 'On';
    }

    async powerOff() {
        await this.sendCmd('Main.Power=Off', true);
        this.powerState = 'Off';
    }

    async setVolume(vol) {
        await this.sendCmd(`Main.Volume=${vol}`, true);
        this.volume = vol;
    }

    async setSource(source) {
        await this.sendCmd(`Main.Source=${source}`, true);
        this.source = source;
    }

    async mute() {
        await this.sendCmd('Main.Mute=On', true);
        this.mute = 'On';
    }

    async unMute() {
        await this.sendCmd('Main.Mute=Off', true);
        this.mute = 'Off';
    }

    async setBrightness(level) {
        await this.sendCmd(`Main.Brightness=${level}`, true);
        this.brightness = level;
    }

    async setBass() {
        await this.sendCmd('Main.Bass=On', true);
        this.bassEqualization = 'On';
    }

    async unsetBass() {
        await this.sendCmd('Main.Bass=Off', true);
        this.bassEqualization = 'Off';
    }

    async setAutoSense() {
        await this.sendCmd('Main.AutoSense=On', true);
        this.autoSense = 'On';
    }

    async unsetAutoSense() {
        await this.sendCmd('Main.AutoSense=Off', true);
        this.autoSense = 'Off';
    }

    async setAutoStandby() {
        await this.sendCmd('Main.AutoStandby=On', true);
        this.autoStandby = 'On';
    }

    async unsetAutoStandby() {
        await this.sendCmd('Main.AutoStandby=Off', true);
        this.autoStandby = 'Off';
    }

    async getPower() {
        return await this.sendCmd('Main.Power?', true);
    }

    async getVolume() {
        return await this.sendCmd('Main.Volume?', true);
    }

    async getSource() {
        return await this.sendCmd('Main.Source?', true);
    }

    async getMute() {
        return await this.sendCmd('Main.Mute?', true);
    }

    async getBrightness() {
        return await this.sendCmd('Main.Brightness?', true);
    }

    async getBass() {
        return await this.sendCmd('Main.Bass?', true);
    }

    async getAutoSense() {
        return await this.sendCmd('Main.AutoSense?', true);
    }

    async getAutoStandby() {
        return await this.sendCmd('Main.AutoStandby?', true);
    }
}

let nad = new NADC338('10.0.0.251');

async function refreshStatus() {
    const power = await nad.getPower();
    const volume = await nad.getVolume();
    const source = await nad.getSource();
    const mute = await nad.getMute();
    const brightness = await nad.getBrightness();
    const bass = await nad.getBass();
    const autoSense = await nad.getAutoSense();
    const autoStandby = await nad.getAutoStandby();

    console.log(`Power: ${power}, Volume: ${volume}, Source: ${source}, Mute: ${mute}, Brightness: ${brightness}, Bass: ${bass}, Auto Sense: ${autoSense}, Auto Standby: ${autoStandby}`);

    volumeSlider.value = volume;
    volumeText.value = volume;
    volumeValue.textContent = volume;

    brightnessSlider.value = brightness;
    brightnessText.value = brightness;
    brightnessValue.textContent = brightness;

    bassToggle.checked = (bass === 'On');
    autoSenseToggle.checked = (autoSense === 'On');
    autoStandbyToggle.checked = (autoStandby === 'On');
}

document.getElementById('setIp').addEventListener('click', () => {
    const ip = document.getElementById('ipAddress').value;
    nad = new NADC338(ip);
});

document.getElementById('powerOn').addEventListener('click', () => nad.powerOn());
document.getElementById('powerOff').addEventListener('click', () => nad.powerOff());

const volumeSlider = document.getElementById('volume');
const volumeText = document.getElementById('volumeText');
const volumeValue = document.getElementById('volumeValue');
volumeSlider.addEventListener('input', () => {
    volumeValue.textContent = volumeSlider.value;
    volumeText.value = volumeSlider.value;
    nad.setVolume(volumeSlider.value);
});
volumeText.addEventListener('input', () => {
    volumeSlider.value = volumeText.value;
    volumeValue.textContent = volumeText.value;
    nad.setVolume(volumeText.value);
});

const sourceSelect = document.getElementById('source');
sourceSelect.addEventListener('change', () => nad.setSource(sourceSelect.value));

document.getElementById('mute').addEventListener('click', () => nad.mute());
document.getElementById('unmute').addEventListener('click', () => nad.unMute());

const brightnessSlider = document.getElementById('brightness');
const brightnessText = document.getElementById('brightnessText');
const brightnessValue = document.getElementById('brightnessValue');
brightnessSlider.addEventListener('input', () => {
    brightnessValue.textContent = brightnessSlider.value;
    brightnessText.value = brightnessSlider.value;
    nad.setBrightness(brightnessSlider.value);
});
brightnessText.addEventListener('input', () => {
    brightnessSlider.value = brightnessText.value;
    brightnessValue.textContent = brightnessText.value;
    nad.setBrightness(brightnessText.value);
});

document.getElementById('setBass').addEventListener('click', () => nad.setBass());
document.getElementById('unsetBass').addEventListener('click', () => nad.unsetBass());

const bassToggle = document.getElementById('bassToggle');
bassToggle.addEventListener('change', () => {
    if (bassToggle.checked) {
        nad.setBass();
    } else {
        nad.unsetBass();
    }
});

const autoSenseToggle = document.getElementById('autoSenseToggle');
autoSenseToggle.addEventListener('change', () => {
    if (autoSenseToggle.checked) {
        nad.setAutoSense();
    } else {
        nad.unsetAutoSense();
    }
});

const autoStandbyToggle = document.getElementById('autoStandbyToggle');
autoStandbyToggle.addEventListener('change', () => {
    if (autoStandbyToggle.checked) {
        nad.setAutoStandby();
    } else {
        nad.unsetAutoStandby();
    }
});

document.getElementById('refresh').addEventListener('click', refreshStatus);
document.getElementById('toggleNadControls').addEventListener('click', () => {
    const nadControls = document.getElementById('nad-control-group');
    nadControls.style.display = nadControls.style.display === 'none' ? 'block' : 'none';
});

setInterval(refreshStatus, nadPollingInterval); // Poll every 10 seconds