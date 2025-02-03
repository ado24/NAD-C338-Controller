# NAD C338 Controller

## Overview
This is a sample controller app for interacting with a node.js proxy server via a RESTful API, for basic controls of the
NAD C338 amplifier. 

It uses JavaScript for the front-end and Node.JS for the back-end server.

## Usage

### Server usage
Run `npm run client` to start the server. Use Ctrl+C to stop the server.
Ensure the binding on TCP ports 9900 (configurable) and 30001 (required) is available.

### Client usage
Open `[hostname]:[port]/client/index.html` in a browser, and set your IP address to whatever your amplifier is set up for.
By default, the URL is set to [https://localhost:9900/index.html](https://localhost:9900/index.html).

#### BluOS controller
BluOS functionality is available as an optional, but added for a unified experience. 

See the OpenAPI spec in [bluos-api.yaml](client/api/bluos-api.yaml) for more information on RESTful API in use.