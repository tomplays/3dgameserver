
socket = io.connect();

var player_color = getRandColor()
var current = { x:0, y:0,z:0, color:0}
// AIzaSyBNLL4n09fRPvHrkMAAgVoRZF8-PhZ-oj8
var map;
var infowindow;


function to_game(pos){
  console.log(pos)
  // coef. scale
  var k = 10000
  // fix origins
  var out = {x: (3-pos.x)*k, y: (49-pos.y)*k }
  return out
}

function initMap() {


	//48.8779977,2.3821988,20z
  var pyrmont = {lat: 48.8779977, lng: 2.3821988};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 18
  });


  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    return
  });




  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 3500,
    type: ['park']
  }, callback);
}



function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
     position: latLng,
     map: map
  });
  map.panTo(latLng);
  // build_map()

  var px = latLng.lng()
  var py = latLng.lat()


  var tt = to_game({x:px, y: py})

  console.log(tt)
  build_map(tt)
}



function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
  	console.log(results)
    for (var i = 0; i < results.length; i++) {

     // createMarker(results[i]);
     
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
 	console.log(place)


  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);




  });


  //tr()
}


function tr(){


 // Define the LatLng coordinates for the polygon's path.
  var triangleCoords = [
    {lat: 25.774, lng: -80.190},
    {lat: 18.466, lng: -66.118},
    {lat: 32.321, lng: -64.757},
    {lat: 25.774, lng: -80.190}
  ];

  // Construct the polygon.
  var bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  });
  bermudaTriangle.setMap(map);

}

function build_map(o){
  console.log('sending to socket')
  socket.emit('build_map',{ 
                       
                       object : {
                                      x: o.y,
                                      y: 0,
                                      player_id:'player_id',
                                      z: o.x,
                                      color: player_color
                              
                                    }
                   
                  
                  }
  );
}

socket.on('build_map_back', function (data) { 
  console.log('build back data')
  console.log(data)

})
key('c', function(){ 
   me_recolor()
});


function me_recolor(){
    var cc = getRandColor()
    player_color = cc
  document.getElementById("me").innerHTML = '<h1 style="color:'+player_color+';">color apply (c to change)</h1>';
 
}



