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

// keywords
var keyword = 'abc';
var clientCount = 0;
var activeStream = null;
var io = null;

// server
var serverio = http.createServer().listen(8080, function()
{
    console.log('Listening at: http://localhost:8080');

    // start socket.io
    io = socketio.listen(serverio);
    io.sockets.on('connection', function (socket)
    {
        clientCount++;
        connectedClientsUpdate();

        socket.on('set:keyword', function(data)
        {
            console.log('Got set new keyword request!!!');
            updateKeyword(data);

            socket.broadcast.emit('get:keyword', keyword);
        });

        socket.on('disconnect', function ()
        {
            clientCount--;
            connectedClientsUpdate();
        });
    });
});

function connectedClientsUpdate()
{
    if (clientCount > 0)
    {
        console.log('Start stream. Clients: ' + clientCount);
        twitterStream = t.stream(
            'statuses/filter', 
            {track: ['#' + keyword]},
            function (stream)
            {
                activeStream = stream;
                stream.on('data', function (tweet)
                {
                    sendTweet(tweet);
                });
            }
        );
    }
    else
    {
        console.log('Stop stream. Clients: ' + clientCount);
        activeStream.destroy();
    }
}

function updateKeyword(new_keyword)
{
    keyword = new_keyword;

    if (activeStream)
    {
        activeStream.destroy();
        connectedClientsUpdate();
    }
}

/**
* Send tweet
*/
function sendTweet(tweet)
{
    // send tweet to the connected client
    if (io.sockets)
    {
        if (!tweet.disconnect)
        {
            io.sockets.emit('tweet', tweet);
        }
    }
}
