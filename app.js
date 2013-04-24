// requires
var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')
    , twitter = require('twitter')
    , credentials = require('./credentials.js');

// server
var server = http.createServer().listen(8080, function()
{
    console.log('Listening at: http://localhost:8080');
});
