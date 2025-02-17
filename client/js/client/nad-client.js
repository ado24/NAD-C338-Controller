import {NAD_C338} from "../model/NAD_C338.js";

const timerWorker = new Worker(new URL("../workers/timerWorker.js", import.meta.url));
const nadPollingInterval = 8500;
const nadOptions = {ip: "10.0.0.251", port: 30001,  protocol: "http"};

let nad = new NAD_C338("10.0.0.251", 30001, "https");

// Controls
const powerOnButton = document.getElementById("powerOn");
const powerOffButton = document.getElementById("powerOff");
const powerToggle = document.getElementById("powerToggle");

const volumeSlider = document.getElementById("volume");
const volumeText = document.getElementById("volumeText");
const volumeValue = document.getElementById("volumeValue");

const muteButton = document.getElementById("mute");
const unmuteButton = document.getElementById("unmute");

const bassToggle = document.getElementById("bassToggle");
const bassSetButton = document.getElementById("setBass");
const bassUnsetButton = document.getElementById("unsetBass");

const sourceSelect = document.getElementById("source");

const brightnessSlider = document.getElementById("brightness");
const brightnessText = document.getElementById("brightnessText");
const brightnessValue = document.getElementById("brightnessValue");

const autoStandbyToggle = document.getElementById("autoStandbyToggle");
const autoSenseToggle = document.getElementById("autoSenseToggle");


const timer = document.getElementById("timer");
const refreshButton = document.getElementById("refresh");
const nadControls = document.getElementById("toggleNadControls");

//Functions

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

    powerToggle.checked = (power === "On");

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

async function setOnTimer() {
    const onTimer = document.getElementById('on-timer').value;
    if (onTimer > 0) {
        timerWorker.postMessage({ type: 'setOnTimer', duration: onTimer });
    }
}

async function setOffTimer() {
    const offTimer = document.getElementById('off-timer').value;
    if (offTimer > 0) {
        timerWorker.postMessage({ type: 'setOffTimer', duration: offTimer });
    }
}

//Web Worker

timerWorker.onmessage = async function(event) {
    const { type } = event.data;
    if (type === 'onTimerComplete') {
        try {
            await nad.powerOn();
            alert('NAD Amplifier turned on');
        } catch (error) {
            console.error('Error turning on the amplifier:', error);
        }
    } else if (type === 'offTimerComplete') {
        try {
            await nad.powerOff();
            alert('NAD Amplifier turned off');
        } catch (error) {
            console.error('Error turning off the amplifier:', error);
        }
    }
};

//Adding Event Listeners

document.getElementById('on-timer-button').addEventListener('click', setOnTimer);
document.getElementById('off-timer-button').addEventListener('click', setOffTimer);

document.getElementById('setIp').addEventListener('click', () => {
    const ip = document.getElementById('ipAddress').value;
    nad = new NAD_C338(ip);
});

powerOnButton.addEventListener('click', () => nad.powerOn());
powerOffButton.addEventListener('click', () => nad.powerOff());

powerToggle.addEventListener('change', () => {
    const newState = powerToggle.checked ? 'on' : 'off';
    newState.toLowerCase() === "on" ? nad.powerOn() : nad.powerOff();
});

muteButton.addEventListener('click', () => nad.setMute());
unmuteButton.addEventListener('click', () => nad.unMute());

volumeSlider.addEventListener('input', () => {
    volumeValue.textContent = volumeSlider.value;
    volumeText.value = volumeSlider.value;
    nad.setVolume(volumeSlider.value).then(r => {}).catch(console.error);
});

volumeText.addEventListener('input', () => {
    volumeSlider.value = volumeText.value;
    volumeValue.textContent = volumeText.value;
    nad.setVolume(volumeText.value).then(r => {}).catch(console.error);
});

sourceSelect.addEventListener('change', () => nad.setSource(sourceSelect.value));

brightnessSlider.addEventListener('input', () => {
    brightnessValue.textContent = brightnessSlider.value;
    brightnessText.value = brightnessSlider.value;
    nad.setBrightness(brightnessSlider.value).then(r => {}).catch(console.error);
});

brightnessText.addEventListener('input', () => {
    brightnessSlider.value = brightnessText.value;
    brightnessValue.textContent = brightnessText.value;
    nad.setBrightness(brightnessText.value).then(r => {}).catch(console.error);
});

bassSetButton.addEventListener('click', () => nad.setBass());
bassUnsetButton.addEventListener('click', () => nad.unsetBass());


bassToggle.addEventListener('change', () => {
    if (bassToggle.checked) {
        nad.setBass().then(r => {}).catch(console.error);
    } else {
        nad.unsetBass().then(r => {}).catch(console.error);
    }
});

autoSenseToggle.addEventListener('change', () => {
    if (autoSenseToggle.checked) {
        nad.setAutoSense().then(r => {}).catch(console.error);
    } else {
        nad.unsetAutoSense().then(r => {}).catch(console.error);
    }
});

autoStandbyToggle.addEventListener('change', () => {
    if (autoStandbyToggle.checked) {
        nad.setAutoStandby().then(r => {}).catch(console.error);
    } else {
        nad.unsetAutoStandby().then(r => {}).catch(console.error);
    }
});

refreshButton.addEventListener('click', refreshStatus);
nadControls.addEventListener('click', () => {
    const nadControls = document.getElementById('nad-control-group');
    nadControls.style.display = nadControls.style.display === 'none' ? 'block' : 'none';
});


//Setting refresh polling interval
setInterval(refreshStatus, nadPollingInterval); // Poll every 10 seconds