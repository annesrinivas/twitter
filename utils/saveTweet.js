var Tweet       =   require('../models/Tweet');
var mongoose    =   require('mongoose');


module.exports = function(data){
    var lng=0;
    var lat=0;
    var coords = [];
    
    if (data['user'] !== undefined) {
        
    if (data.coordinates){
        
             if (data.coordinates !== null){
             
              lng = data.coordinates.coordinates[0];
              lat = data.coordinates.coordinates[1];
              //console.log('SAVE Found a tweet in' + data.coordinates.coordinates[0] + data.coordinates.coordinates[1]);
                                              }
               }
             else if(data.place){
                           if(data.place.bounding_box.type === 'Polygon')
                          {
                                //console.log('in poly');
                                //console.log (data.place.bounding_box.coordinates[0]);
                                
                                
                                var coord, _i, _len;
                                var centerLat = 0;
                                var centerLng = 0;
                                var coords =  data.place.bounding_box.coordinates[0];
                                
                                for (_i = 0, _len = coords.length; _i < _len; _i++) {
                                    coord = coords[_i];
                                    centerLat += coord[0];
                                    centerLng += coord[1];
                                    }
                                    lat = centerLat / coords.length;
                                    lng = centerLng / coords.length;
                                //console.log('in poly with ' + lat + " AND " + lng );
                    // Build json object and broadcast it
                    //var outputPoint = {"lat": centerLat,"lng": centerLng}; */

                          }
                         };  
 
      // Construct a new tweet object
      var tweet = {
        twid: data['id_str'],
        active: false,
        author: data['user']['name'],
        avatar: data['user']['profile_image_url'],
        body: data['text'],
        date: data['created_at'],
        screenname: data['user']['screen_name'],
        loc : [lng,lat]
      };
        
      // Create a new model instance with our object
      var tweetEntry = new Tweet(tweet);
          
         tweetEntry.save(function(err) {
        if (err) {
                console.log(err);
          }
       //console.log('Saved with ' + lng +'   ' +lat) ;    
        
      });
                
  }
  
   
};




