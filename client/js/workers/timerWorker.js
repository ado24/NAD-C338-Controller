self.onmessage = function(event) {
    const { type, duration } = event.data;
    if (type === 'setOnTimer') {
        setTimeout(() => {
            self.postMessage({ type: 'onTimerComplete' });
        }, duration * 1000);
    } else if (type === 'setOffTimer') {
        setTimeout(() => {
            self.postMessage({ type: 'offTimerComplete' });
        }, duration * 1000);
    }
};