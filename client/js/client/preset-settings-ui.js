// UI Management for the Preset Settings Flyout

class PresetSettingsFlyout {
    constructor() {
        this.flyoutElement = document.createElement('div');
        this.flyoutElement.className = 'preset-settings-flyout';
        this.init();
    }

    init() {
        this.flyoutElement.innerHTML = `
            <h2>Preset Settings</h2>
            <button id='close'>Close</button>
            <div class='settings-container'>
                <!-- Preset settings will be injected here -->
            </div>
        `;
        document.body.appendChild(this.flyoutElement);
        document.getElementById('close').addEventListener('click', () => this.close());
    }

    open() {
        this.flyoutElement.style.display = 'block';
    }

    close() {
        this.flyoutElement.style.display = 'none';
    }
}

// Export for use in other modules
export default PresetSettingsFlyout;