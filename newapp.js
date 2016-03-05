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

var mongoUrl='mongodb://localhost/newtweetsmarch';


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
var users=[];

//Create web sockets connection.
io.sockets.on('connection', function (socket) {
  
   // The user it's added to the array if it doesn't exist
    if(users.indexOf(socket.id) === -1) {
        users.push(socket.id);
         console.log('new client connected');
    }  
    
  // Log
  logConnectedUsers();

  socket.on('start tweets', function() {
      
    if(stream === null) {
        
      console.log('Staream is null. starting tweets');
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
                                                    
                                                    if(users.length > 0) {
                                                    //Send out to web sockets channel.
                                                    socket.emit('twitter-stream', data);
                                                    }
                                                    else {
                                                            // Stop if there are no users
                                                            console.log('destoying stream');
                                                            stream.destroy();
                                                            stream = null;
                                                        }
                                    
              });
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
              
             stream.on('error', function(error) {
		     console.log("Error with stream" + error);
              
	       })
    
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
     socket.emit('connected');
     console.log('new client connected');
     
    // This handles when a user is disconnected
    socket.on("disconnect", function(o) {
        // find the user in the array
        var index = users.indexOf(socket.id);
        if(index != -1) {
            // Eliminates the user from the array
            users.splice(index, 1);
        }
        logConnectedUsers();
        console.log("user disconnected");
    });
  });
  




  // A log function for debugging purposes
function logConnectedUsers() {
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}














