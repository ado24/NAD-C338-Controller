export class PresetSettings {
    constructor() {
        this.presets = this.loadPresetsFromLocalStorage();
        this.currentPreset = null;
    }

    loadPresetsFromLocalStorage() {
        const stored = localStorage.getItem('presetSettings');
        return stored ? JSON.parse(stored) : {};
    }

    savePresetsToLocalStorage() {
        localStorage.setItem('presetSettings', JSON.stringify(this.presets));
    }

    createPreset(name, settings) {
        this.presets[name] = {
            name: name,
            timestamp: new Date().toISOString(),
            nad: {
                power: settings.nad?.power || 'Off',
                volume: settings.nad?.volume || -20,
                source: settings.nad?.source || 'Stream',
                mute: settings.nad?.mute || false,
                brightness: settings.nad?.brightness || 2,
                bass: settings.nad?.bass || 'Off',
                autoSense: settings.nad?.autoSense || 'Off',
                autoStandby: settings.nad?.autoStandby || 'Off'
            },
            bluos: {
                volume: settings.bluos?.volume || 50,
                shuffle: settings.bluos?.shuffle || false,
                playState: settings.bluos?.playState || 'paused'
            }
        };
        this.savePresetsToLocalStorage();
        return this.presets[name];
    }

    deletePreset(name) {
        delete this.presets[name];
        this.savePresetsToLocalStorage();
    }

    getPreset(name) {
        return this.presets[name];
    }

    getAllPresets() {
        return this.presets;
    }

    updatePreset(name, settings) {
        if (this.presets[name]) {
            this.presets[name] = {
                ...this.presets[name],
                ...settings,
                timestamp: new Date().toISOString()
            };
            this.savePresetsToLocalStorage();
            return this.presets[name];
        }
        return null;
    }

    getCurrentSettings(nadDevice, bluosDevice) {
        return {
            nad: {
                power: nadDevice.power || 'Off',
                volume: nadDevice.volume || -20,
                source: nadDevice.source || 'Stream',
                mute: nadDevice.mute || false,
                brightness: nadDevice.brightness || 2,
                bass: nadDevice.bass || 'Off',
                autoSense: nadDevice.autoSense || 'Off',
                autoStandby: nadDevice.autoStandby || 'Off'
            },
            bluos: {
                volume: bluosDevice.volume || 50,
                shuffle: bluosDevice.shuffle || false,
                playState: bluosDevice.playState || 'paused'
            }
        };
    }
}