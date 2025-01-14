# NAD C338 Controller

## Overview
This is a sample controller app for interacting with a node.js proxy server via a RESTful API, for basic controls of the
NAD C338 amplifier. 

It uses JavaScript for the front-end and Node.JS for the back-end server.

## Server usage
From the `[root]\server` directory, run `node server.js` to start the server. Use Ctrl+C to stop the server.
Ensure the binding on port 30001 is available.

## Client usage
Open `client\index.html` in a browser, and set your IP address to whatever your amplifer is set up for.
BluOS functionality is optional, but added for a unifed experience