const express = require("express");

const routes = require("./routes");

const server = express();

server.use(express.json());

server.use(routes);

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  server.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = server;
