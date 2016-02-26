

// AIzaSyBNLL4n09fRPvHrkMAAgVoRZF8-PhZ-oj8
var map;
var infowindow;

function initMap() {


	//48.8779977,2.3821988,20z
  var pyrmont = {lat: 48.8779977, lng: 2.3821988};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 18
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 3500,
    types: ['park','point_of_interest']
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
  	console.log(results)
    for (var i = 0; i < results.length; i++) {

      createMarker(results[i]);
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


  tr()
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

var c;
var  player_id
var  player_color;
var socket;
var camera, scene, renderer,light;
var effect;
socket = io.connect();
socket.emit('load')

function init() {}
function gotPosition(position) {
	
	// top north : 48.8985587  2.3592401,21
	// south = 	   48.8194131  2.3446799,21
	// E     	   48.8415116  2.2531099,20
	// W     	   48.8541586  2.4141059,20

	var l_ = 8806.042
	var lg = 3830.294
	// var l = position.coords.latitude
	// var L = position.coords.longitude
	var m =  scene.getObjectByName(player_id);

	m.position.x = 0 //lg
	m.position.z = 0//  l_;]
}
function showError(){}

// keyBoard binding 
    
key('left', function(){ 
  me_move('left')
});
key('right', function(){ 
  me_move('right')
});

key('up', function(){ 
  me_move('up')
});
key('down', function(){ 
  me_move('down')
});

key('m', function(){ 
  me_move('m')
});

key('l', function(){ 
  me_move('l')
});

key('space', function(){ 
  me_build()
});

key('c', function(){ 
   me_recolor()
});


key('j', function(){ 
  // cam_move('sky')
});
key('k', function(){ 
  // cam_move('ground')
});

function me_build(){
  var e = scene.getObjectByName(player_id);
  socket.emit('build', 
                  { 
                    player_id:player_id,
                   	build:{
                            type: 'cube',
                            x: 	e.position.x,
                            y:  e.position.y,
                            z:  e.position.z,
                    	    color:player_color
                           }
                             
                  }
      );
}



function me_recolor(){
    var cc = getRandColor()
    player_color = cc
	document.getElementById("me").innerHTML = '<h1 style="color:'+player_color+';">your id:'+player_name+'</h1>';
	var e = scene.getObjectByName(player_id);
	e.material = new THREE.MeshStandardMaterial( { color: player_color});
	// e.setAttribute('material','color:'+player_color);
}

function me_move(dir){
	var m =  scene.getObjectByName(player_id);
	var mep  = m.position
	mep_x = mep.x
	mep_y = mep.y
	mep_z = mep.z
	if(dir == 'left'){
	    mep_x = mep.x-10
	}
	if(dir == 'right'){
	    mep_x = mep.x+10
	}
	if(dir == 'up'){
	    mep_z = mep.z-10
	}
	  if(dir == 'down'){
	    mep_z = mep.z+10
	}
	if(dir == 'l'){
	    mep_y = mep.y-1
	}

	if(dir == 'm'){
	    mep_y = mep.y+1
	}
	m.position.x =  mep_x
	m.position.y =  mep_y
	m.position.z =   mep_z;
	console.log(m.position)
	if(light){
		   	light.position.set( mep_x, mep_y,mep_z );
	}
	camera.position.set( mep_x, mep_x, mep_z);
	//    var cam = document.querySelector('a-camera')
	//  var campos = mep_x+' '+(mep_y+3)+' '+(mep_z+20);
	//cam.setAttribute('position', campos);
	socket.emit('move',{ 
	           				 player_id:player_id,
			                 move : {
			                 				x: mep_x,
			                                y: mep_y,
			                                z: mep_z,
			                                color: player_color
			                        
			                              }
	                 
	                
	          			}
	);

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	effect.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	var time = performance.now() * 0.0005;
	//	camera.position.x = Math.cos( time ) * 4;
	//camera.position.z = Math.sin( time ) * 4;
	//	camera.lookAt( new THREE.Vector3() );
	var m =  scene.getObjectByName(player_id);
	var mep  = m.position
	camera.lookAt( new THREE.Vector3( mep.x, mep.y, mep.z) );
	//camera.position.set( mep.x-5, mep.y+6, mep.z-6);
	effect.render( scene, camera );
}

socket.on('loaded', function (data) { 

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.set( 10, 16, 10 );
	camera.lookAt( new THREE.Vector3(0,0,0) );
	//camera.focalLength = camera.position.distanceTo( new THREE.Vector3() );

	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0xeef0ff ) );
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );


	var texture = new THREE.TextureLoader().load( "images/map-paris.png" );

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1,1 );

	var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
	var geometry = new THREE.CubeGeometry( 1000, 1, 1000 );
	geometry.rotateX( - Math.PI / 2 );

	//var material = new THREE.MeshStandardMaterial();
	var mesh = new THREE.Mesh( geometry, material1 );
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );
	//


	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -1, 1.5, 0.5 );
	light.castShadow = true;
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xff0000, 5.5 );
	light.position.set( 1, 1.5, -0.5 );
	light.castShadow = true;
	scene.add( light );

	//

	player_id 		=  data.me.player_id
	player_color 	=  data.me.color
	player_name 	=  data.me.player_name

	c = data.game.world.room.objects.length
	document.getElementById("count").innerHTML = '<h1>'+c+' objects</h1>';
	document.getElementById("me").innerHTML = '<h1 style="color:'+player_color+';">your id:'+player_name+'</h1>';                   
	
	_.each(data.game.world.room.objects, function(o){
		console.log(o)
		if(o.player_id == player_id){
			console.log('isme')
		}
		else{
			console.log('iselse')
		}

		/// CCCC 
		var geometry = new THREE.CubeGeometry( 10, 10, 10 );
		var material = new THREE.MeshStandardMaterial( { color: o.color });
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = o.x;
		mesh.position.y = o.y;
		mesh.position.z = o.z;
		mesh.name = o.player_id
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		console.log(mesh)
		scene.add( mesh );
	})

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xbfd1e5 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//	renderer.shadowMap.enabled = window.location.search === "";
	document.body.appendChild( renderer.domElement );
	//
	effect = new THREE.CardboardEffect( renderer );
	effect.setSize( window.innerWidth, window.innerHeight );
	//
	window.addEventListener( 'resize', onWindowResize, false );
	navigator.geolocation.getCurrentPosition(gotPosition, showError, { enableHighAccuracy: true, maximumAge: 600000 });
	animate();
})


// a player moved
socket.on('moveback', function (data) { 
	console.log('player_id:;'+data.player_id)

	var t = scene.getObjectByName(data.player_id)

	if(t){
	  console.log('target moved')
	  t.position.set(data.move.x,data.move.y,data.move.z);
	}
	else{
		/// CCCC 
		console.log('target init +moved')
		var o = data.move
		var geometry = new THREE.CubeGeometry( 1, 1, 1 );
		var material = new THREE.MeshStandardMaterial( { color: o.color });
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = o.x;
		mesh.position.y = o.y;
		mesh.position.z = o.z;
		mesh.name = data.player_id
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		console.log(mesh)
		scene.add( mesh );
	}
	//console.log(data.actions[0].test.oe)
})

// a player built a cube
socket.on('buildback', function (data) {       
	//console.log(data)
	var o = data.build
	/// CCCC 

	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	var material = new THREE.MeshStandardMaterial( { color: o.color });
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = o.x;
	mesh.position.y = o.y;
	mesh.position.z = o.z;
	mesh.name = o.player_id
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	console.log(mesh)
	scene.add( mesh );
})

// new player in room
socket.on('new_player', function (data) { 
  	console.log('newplayer')
   	c = c+1
	var o = data


	/// CCCC 
	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	var material = new THREE.MeshStandardMaterial( { color: o.color });
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = o.x;
	mesh.position.y = o.y;
	mesh.position.z = o.z;
	mesh.name = o.player_id
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	console.log(mesh)
	scene.add( mesh );
	document.getElementById("count").innerHTML = '<h1>'+c+' players</h1>';
})

// if a player leave room
socket.on('remove_player', function (data) { 
	console.log('player_left')
	var t =  scene.getObjectByName(data.player_id)
	scene.remove(t)
	c = c-1
	document.getElementById("count").innerHTML = '<h1>'+c+' players</h1>';
})
init();

