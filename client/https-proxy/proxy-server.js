import httpProxy from 'http-proxy';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config({'path': '../client-server.env'});

const endpointIp = process.env.BLUOS_IP;
const endpointPort = process.env.BLUOS_PORT;
const endpointKeyPath = process.env.SERVER_KEY_PATH;
const endpointCertPath = process.env.SERVER_CERT_PATH;
const proxyPort = process.env.PROXY_PORT;

const proxy = httpProxy.createProxyServer({
    target: `http://${endpointIp}:${endpointPort}`,
    changeOrigin: true,
    upgrade: true,
    secure: false
});

const httpsOptions = {
    key: fs.readFileSync(endpointKeyPath),
    cert: fs.readFileSync(endpointCertPath)
};

// Cache settings based on content type
const cacheSettings = {
    images: 'public, max-age=86400', // 24 hours for images
    audio: 'no-cache', // No caching for audio
    status: 'no-store', // No storing for status updates
    default: 'public, max-age=3600' // 1 hour default
};

proxy.on('proxyRes', (proxyRes, req, res) => {
    // Handle redirects
    if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
        const location = proxyRes.headers.location;
        if (location.toString().startsWith("http://resources.tidal.com/")) {
            res.writeHead(302, {
                'Location': location.replace('http://', 'https://')
            });
            res.end();
            return;
        }
    }

    // Add cache control headers
    const contentType = proxyRes.headers['content-type'] || '';

    if (contentType.includes('image')) {
        res.setHeader('Cache-Control', cacheSettings.images);
    } else if (contentType.includes('audio')) {
        res.setHeader('Cache-Control', cacheSettings.audio);
    } else if (req.url.includes('Status') || req.url.includes('SyncStatus')) {
        res.setHeader('Cache-Control', cacheSettings.status);
    } else {
        res.setHeader('Cache-Control', cacheSettings.default);
    }
});

const server = https.createServer(httpsOptions, (req, res) => {
    // Set CORS headers before proxying
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    proxy.web(req, res);
});

// Add error handling for the proxy
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Proxy error');
});

server.listen(proxyPort, () => {
    console.log(`Proxy server running on https://localhost:${proxyPort}`);
});