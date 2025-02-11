// This is a test file for the NAD-C338 class
//import { NAD_C338 } from '../js/model/NAD_C338.js';
import { jest } from '@jest/globals';
import { beforeEach, describe, test, expect } from '@jest/globals';

//jest.mock('node-fetch', () => jest.fn());
jest.unstable_mockModule('node-fetch', () => jest.fn());
// jest.unstable_mockModule('NAD_C338', () => {
//     return {
//         NAD_C338: jest.fn().mockImplementation(() => {
//             return {
//                 powerOn: jest.fn(),
//                 powerOff: jest.fn(),
//                 setVolume: jest.fn(),
//                 setSource: jest.fn(),
//                 setMute: jest.fn(),
//                 unMute: jest.fn()
//             };
//         })
//     };
// });

const fetch = await import('node-fetch');
const { NAD_C338 } = await import('../js/model/NAD_C338.js');

describe('NAD_C338', () => {
    const ip = 'localhost';
    const port = 3000;
    const protocol = 'http';
    let nad;

    beforeEach(() => {
        nad = new NAD_C338(ip, port, protocol);
        fetch.mockClear();
    });

    test('should power on the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.powerOn();

        expect(fetch).toHaveBeenCalledWith(`${protocol}://${ip}:${port}/power`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ state: 'On' })
        }));
    });

    test('should power off the device', async () => {
        let ret = fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.powerOff();

        expect(fetch).toHaveBeenCalledWith(`${protocol}://${ip}:${port}/power`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ state: 'Off' })
        }));
    });

    test('should set the volume', async () => {
        const volume = 20;
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.setVolume(volume);

        expect(fetch).toHaveBeenCalledWith(`${protocol}://${ip}:${port}/volume`, expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ level: volume })
        }));
    });

    test('should set the source', async () => {
        const source = 'Stream';
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.setSource(source);

        expect(fetch).toHaveBeenCalledWith(`${protocol}://${ip}:${port}/source`, expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ source })
        }));
    });

    test('should mute the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.setMute();

        expect(fetch).toHaveBeenCalledWith(`${protocol}://${ip}:${port}/mute`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({mute: "Off"})
        }));
    });

    test('should unmute the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.unMute();

        expect(fetch).toHaveBeenCalledWith(`${protocol}://${ip}:${port}/unmute`, expect.objectContaining({
            method: 'POST',
            body: 'Ok'
        }));
    });

    // Add more tests for other methods similarly
});