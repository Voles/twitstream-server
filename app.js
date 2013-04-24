// requires
var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')
    , twitter = require('ntwitter');

// twitter api connection
var t = new twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
});

// server
var server = http.createServer().listen(8080, function()
{
    console.log('Listening at: http://localhost:8080');
});

// socket.io
socketio.listen(server).on('connection', function (socket)
{
	// open twitter stream
	
		t.stream('statuses/filter', {track: ['javascript']},
	        function(stream)
	        {
				stream.on('data', function(tweet)
				{
					// send tweet to the connected client
					socket.emit('tweet', tweet);
				});
	        }
	    );
	
});