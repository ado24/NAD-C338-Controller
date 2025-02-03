// This is a test file for the NAD-C338 class
import { NADC338 } from '../model/NAD-C338.js';
import fetch from 'node-fetch';
import * as jest from "node/test.js";
import {beforeEach, describe, it} from "node:test";


jest.mock('node-fetch', () => jest.fn());

describe('NADC338', () => {
    const ip = '10.0.0.251';
    const port = 3000;
    let nad;

    beforeEach(() => {
        nad = new NADC338(ip, port);
        fetch.mockClear();
    });

    it('should power on the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.powerOn();

        expect(fetch).toHaveBeenCalledWith(`http://${ip}:${port}/power`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ state: 'On' })
        }));
    });

    it('should power off the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.powerOff();

        expect(fetch).toHaveBeenCalledWith(`http://${ip}:${port}/power`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ state: 'Off' })
        }));
    });

    it('should set the volume', async () => {
        const volume = 20;
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.setVolume(volume);

        expect(fetch).toHaveBeenCalledWith(`http://${ip}:${port}/volume`, expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ level: volume })
        }));
    });

    it('should set the source', async () => {
        const source = 'CD';
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.setSource(source);

        expect(fetch).toHaveBeenCalledWith(`http://${ip}:${port}/source`, expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ source })
        }));
    });

    it('should mute the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.setMute();

        expect(fetch).toHaveBeenCalledWith(`http://${ip}:${port}/mute`, expect.objectContaining({
            method: 'POST'
        }));
    });

    it('should unmute the device', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        await nad.unMute();

        expect(fetch).toHaveBeenCalledWith(`http://${ip}:${port}/unmute`, expect.objectContaining({
            method: 'POST'
        }));
    });

    // Add more tests for other methods similarly
});