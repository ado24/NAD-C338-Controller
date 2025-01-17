// BluOS API interaction
const bluOSPlayerIP = '10.0.0.208';
const bluOSPlayerPort = '11000';
const bluosPollingInterval = 10000;

async function sendBluOSCommand(path) {
    const url = `http://${bluOSPlayerIP}:${bluOSPlayerPort}/${path}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        return xmlDoc;
    } catch (error) {
        console.error('Error sending BluOS command:', error);
    }
}

async function updateStatus() {
    const status = await sendBluOSCommand('Status');
    if (status) {
        document.getElementById('trackTitle').textContent = `Title: ${status.getElementsByTagName('title1')[0].textContent || 'N/A'}`;
        document.getElementById('trackArtist').textContent = `Artist: ${status.getElementsByTagName('artist')[0].textContent || 'N/A'}`;
        document.getElementById('trackAlbum').textContent = `Album: ${status.getElementsByTagName('album')[0].textContent || 'N/A'}`;
        document.getElementById('trackArt').src = status.getElementsByTagName('image')[0].textContent || '';
        document.getElementById('streamInfo').textContent = `Stream Info: ${status.getElementsByTagName('streamFormat')[0].textContent || 'N/A'}`;

        const quality = status.getElementsByTagName('quality')[0].textContent.toUpperCase() || '';
        const qualityElement = document.getElementById('qualityType');
        if (quality.includes('MQA')) {
            qualityElement.innerHTML = 'MQA <br/><img style="width: 121.73px; height: 50px;" src="images/mqa-logo.png" alt="MQA Logo" />';
        } else {
            qualityElement.textContent = quality;
        }

        const volume = status.getElementsByTagName('volume')[0].textContent || '50';
        bluOSVolumeSlider.value = volume;
        bluOSVolumeText.value = volume;
        bluOSVolumeValue.textContent = volume;
    }
}

document.getElementById('play').addEventListener('click', () => sendBluOSCommand('Play'));
document.getElementById('pause').addEventListener('click', () => sendBluOSCommand('Pause'));
document.getElementById('skip').addEventListener('click', () => sendBluOSCommand('Skip'));
document.getElementById('back').addEventListener('click', () => sendBluOSCommand('Back'));
document.getElementById('stop').addEventListener('click', () => sendBluOSCommand('Stop'));
document.getElementById('getStatus').addEventListener('click', updateStatus);
document.getElementById('getSyncStatus').addEventListener('click', () => sendBluOSCommand('SyncStatus'));
document.getElementById('reboot').addEventListener('click', () => sendBluOSCommand('reboot'));

const bluOSVolumeSlider = document.getElementById('bluOSVolume');
const bluOSVolumeText = document.getElementById('bluOSVolumeText');
const bluOSVolumeValue = document.getElementById('bluOSVolumeValue');
bluOSVolumeSlider.addEventListener('input', () => {
    bluOSVolumeValue.textContent = bluOSVolumeSlider.value;
    bluOSVolumeText.value = bluOSVolumeSlider.value;
    sendBluOSCommand(`Volume?level=${bluOSVolumeSlider.value}`);
});
bluOSVolumeText.addEventListener('input', () => {
    bluOSVolumeSlider.value = bluOSVolumeText.value;
    bluOSVolumeValue.textContent = bluOSVolumeText.value;
    sendBluOSCommand(`Volume?level=${bluOSVolumeText.value}`);
});
document.getElementById('toggleBluOsControls').addEventListener('click', () => {
    const bluOsControls = document.getElementById('bluOs-control-group');
    bluOsControls.style.display = bluOsControls.style.display === 'none' ? 'block' : 'none';
});

// Poll every 10 seconds
setInterval(updateStatus, bluosPollingInterval);