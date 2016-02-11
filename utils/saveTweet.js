var Tweet       =   require('../models/Tweet');
var mongoose    =   require('mongoose');


module.exports = function(data){
    if (data['user'] !== undefined) {

      // Construct a new tweet object
      var tweet = {
        twid: data['id_str'],
        active: false,
        author: data['user']['name'],
        avatar: data['user']['profile_image_url'],
        body: data['text'],
        date: data['created_at'],
        screenname: data['user']['screen_name'],
        //loc : {
        //        type: [data.coordinates.coordinates[0], data.coordinates.coordinates[1]]
        //}
        
      };

      // Create a new model instance with our object
      var tweetEntry = new Tweet(tweet);
          
         tweetEntry.save(function(err) {
        if (err) {
                console.log(err);
          }
      });
                
  }
};




