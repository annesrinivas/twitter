var express=require('express');
var app=express();
var http=require('http');
var server=http.createServer(app);
var io = require('socket.io').listen(server);

var twitter = require('twitter');
var config=require ('./config.js');
var saveTweet=require('./utils/saveTweet');
var port = (process.env.PORT || 80);
var tweetsSaved=0;
var stream=null;
var mongoose=require('mongoose');

var mongoUrl='mongodb://localhost/newtweets';


// Use connect method to connect to the Server
mongoose.connect(mongoUrl, function (err, db) {
  if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', mongoUrl);
  }
  });
  

server.listen(port);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

app.get('/', function (req,res){
    res.sendFIle('./index.html');
});

var twit=new twitter(config.twitter);

app.get('/status', function (req, res) {
    twit.verifyCredentials(function (error, data) {
        res.send("Hello,"  + data.name + "</br> </br></br> Tweets saved since server start:"+tweetsSaved);
       
    });
});

//Create web sockets connection.
io.sockets.on('connection', function (socket) {
    
  console.log('new client connected');

  socket.on('start tweets', function() {
      
   

    if(stream === null) {
        
      console.log('starting tweets');
      //Connect to twitter stream passing in filter a box between NY and SF
      twit.stream('statuses/filter', {'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(stream) {
              stream.on('data', function(data) {
                                                   //Save tweet
                                                   saveTweet(data);
                                                   //Update counter
                                                   tweetsSaved++;
                                                                                                  
                                                   // Update the console every 50 analyzed tweets
                                                    if (tweetsSaved % 50 === 0) {
                                                        console.log("Tweet #" + tweetsSaved );
                                                    }
                                                    //Send out to web sockets channel.
                                                    socket.emit('twitter-stream', data);
                                                    }
                                                );
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
     socket.emit('connected');
     console.log('new client connected');
     
    
     socket.on('disconnect', function () {
     console.log('a client disconnecte');
  });
  
});
















