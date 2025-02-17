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

// Create a proxy server
const proxy = httpProxy.createProxyServer({
    target: `http://${endpointIp}:${endpointPort}`,
    changeOrigin: true,
    upgrade: true,
    secure: false
});

// Create an HTTPS server
const httpsOptions = {
    key: fs.readFileSync(endpointKeyPath),
    cert: fs.readFileSync(endpointCertPath)
};

// Listen for the proxyRes event to handle 301 redirects for Tidal images coming from BluOs
proxy.on('proxyRes', (proxyRes, req, res) => {
    if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
        const location = proxyRes.headers.location;
        if (location.toString().startsWith("http://resources.tidal.com/")) {
            res.writeHead(302, {
                'Location': location.replace('http://', 'https://')
            });
            res.end();
        }
    }
});

const server = https.createServer(httpsOptions, (req, res) => {
    proxy.web(req, res);
});

server.listen(proxyPort, () => {
    console.log(`Proxy server running on https://localhost:${proxyPort}`);
});