

var c;
var  player_id;
var  player_color;
var socket;
var camera, scene, renderer,light;
var effect;
			var worldWidth = 256, worldDepth = 256;

socket = io.connect();
socket.emit('load')

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

	m.position.x = 6170.504093170166
	m.position.z = 1191.7476220693147
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
	//console.log(m.position)
	if(light){
		   	//light.position.set( mep_x, mep_y,mep_z );
	}


	camera.position.set( mep_x, mep_y+2, mep_z+5);



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
	//effect.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );

		
	render();
}

var op_ = 0.1
function render() {
	var time = performance.now() * 0.0005;
	var dtime = performance.now()  * 10;

	//var op = Math.floor(Math.random() * 10) / 10
	
		//: sun time
			//console.log(op_)
			if(op_ > 1){
				op_ = 0.1
			}
			else{
			//	renderer.setClearColor( 0x1e4687, op_ ); 
				op_ = op_+0.01// second param is opacity, 0 => transparent
			}
	
	



		var d = scene.getObjectByName('ice');
		if(d){
		//	console.log(d.geometry.vertices[0])
			_.each(d.geometry.vertices, function(v){
	///		 console.log(v.x)
		//	 v.x = v.x +1;
		//	  v.z = v.z+1;
		//   v.z = v.y * Math.random()
		//	   			   v.z = v.z * Math.random()

			/// v.position = v * Math.random()*10;
		})

			for ( var i = 0, l = d.geometry.vertices.length; i < l; i ++ ) {



				var num = Math.floor(Math.random()*2); // this will get a number between 1 and 99;
				num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

				d.geometry.vertices[ i ].z = d.geometry.vertices[ i ].z+ (num/4)

				d.geometry.vertices[ i ].x = d.geometry.vertices[ i ].x+(num/9)


				d.geometry.vertices[ i ].y = d.geometry.vertices[ i ].y+(num/3)

			}


 d.geometry.verticesNeedUpdate = true;


		//if(e){
			//  e.geometry.rotateX( - (Math.PI / 2+(Math.random())) );


		//}


		  }
/*	

				//



			
		

		

		


	//	e.geometry.attributes.position.array = vertices

     

		 e.geometry.attributes.position.array  = vertices
*/
	//	camera.position.x = Math.cos( time ) * 4;
	//camera.position.z = Math.sin( time ) * 4;
	//	camera.lookAt( new THREE.Vector3() );
	var m =  scene.getObjectByName(player_id);
	var mep  = m.position
//	camera.lookAt( new THREE.Vector3( mep.x, mep.y, mep.z) );
//    camera.position.set( mep.x-5, mep.y+19, mep.z-6);
	////// effect.render( scene, camera );
controls.update();

	renderer.render( scene, camera );

}

socket.on('loaded', function (data) { 


	            camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.y = 10




///camera.lookAt( new THREE.Vector3(camera.position) );


				controls = new THREE.TrackballControls( camera );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;

				scene = new THREE.Scene();
scene.add( new THREE.AmbientLight( 0xffffff ) );

scene.fog = new THREE.FogExp2( 0x1e4683, 0.0025 );

				var light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 191.7476220693147 , 3, 6170.504093170166 );
				light.castShadow = true;
				light.rotateY( - Math.PI / 2 );

			//	light.shadowCameraNear = 2000000000000000;
			//	light.shadowCameraFar = camera.far;
			//	light.shadowCameraFov = 50;

			//	light.shadowBias = -0.00022;

			//	light.shadowMapWidth = 2048;
			//	light.shadowMapHeight = 2048;

			//	scene.add( light );



/*
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
	// scene.add( hemiLight );
*/
	var texture = new THREE.TextureLoader().load( "images/s.png" );
	//MarsMap.jpg

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 10,10 );

	var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
	var geometry = new THREE.CubeGeometry( 10000, 200, 10000 );
	geometry.rotateY( - Math.PI / 2 );

	//var material = new THREE.MeshStandardMaterial();
	var mesh = new THREE.Mesh( geometry, material1 );


	mesh.position.set(1222.6917007520656,-101,5891.876220703125)
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	 scene.add( mesh );




			


geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
				geometry.rotateX( - Math.PI / 2 );

				for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

					geometry.vertices[ i ].y = 35 * Math.sin( i / 2 );

				}

				var texture = new THREE.TextureLoader().load( "images/man.jpg" );
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set( 5, 5 );

				material = new THREE.MeshBasicMaterial( { color: 0x0044ff, map: texture } );
mesh.name = 'icde'

				mesh = new THREE.Mesh( geometry, material );
			//	scene.add( mesh );




/*
	var texture = new THREE.TextureLoader().load( "images/mon.png" );
	//MarsMap.jpg

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 4,1 );
	var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
	var geometry = new THREE.CubeGeometry( 1, 1000, 5000 );
	geometry.rotateY( - Math.PI / 2 );

	//var material = new THREE.MeshStandardMaterial();
	var mesh = new THREE.Mesh( geometry, material1 );


	mesh.position.set(122.6917007520656,200,5691.876220703125)
	mesh.castShadow = true;
	mesh.receiveShadow = true;

//	scene.add( mesh );

*/


	var texture = new THREE.TextureLoader().load( "images/man.jpg" );
	//MarsMap.jpg

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1,1 );
	var material1 = new THREE.MeshPhongMaterial( {  map: texture } );
	var geometry = new THREE.CubeGeometry( 1,64, 414 );
	geometry.rotateY( - Math.PI / 2 );

	//var material = new THREE.MeshStandardMaterial();
	var mesh = new THREE.Mesh( geometry, material1 );


	mesh.position.set(1202.6917007520656,32,5591.876220703125)
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	// scene.add( mesh );

var triangles = 500000;

				var geometry = new THREE.BufferGeometry();

				var indices = new Uint32Array( triangles * 3 );

				for ( var i = 0; i < indices.length; i ++ ) {

					indices[ i ] = i;

				}

				var positions = new Float32Array( triangles * 3 * 3 );
				var normals = new Float32Array( triangles * 3 * 3 );
				var colors = new Float32Array( triangles * 3 * 3 );

				var color = new THREE.Color();

				var n = 800, n2 = n/2;	// triangles spread in the cube
				var d = 12, d2 = d/2;	// individual triangle size

				var pA = new THREE.Vector3();
				var pB = new THREE.Vector3();
				var pC = new THREE.Vector3();

				var cb = new THREE.Vector3();
				var ab = new THREE.Vector3();

				for ( var i = 0; i < positions.length; i += 9 ) {

					// positions

					var x = Math.random() * n - n2;
					var y = Math.random() * n - n2;
					var z = Math.random() * n - n2;

					var ax = x + Math.random() * d - d2;
					var ay = y + Math.random() * d - d2;
					var az = z + Math.random() * d - d2;

					var bx = x + Math.random() * d - d2;
					var by = y + Math.random() * d - d2;
					var bz = z + Math.random() * d - d2;

					var cx = x + Math.random() * d - d2;
					var cy = y + Math.random() * d - d2;
					var cz = z + Math.random() * d - d2;

					positions[ i ]     = ax;
					positions[ i + 1 ] = ay;
					positions[ i + 2 ] = az;

					positions[ i + 3 ] = bx;
					positions[ i + 4 ] = by;
					positions[ i + 5 ] = bz;

					positions[ i + 6 ] = cx;
					positions[ i + 7 ] = cy;
					positions[ i + 8 ] = cz;

					// flat face normals

					pA.set( ax, ay, az );
					pB.set( bx, by, bz );
					pC.set( cx, cy, cz );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					cb.normalize();

					var nx = cb.x;
					var ny = cb.y;
					var nz = cb.z;

					normals[ i ]     = nx;
					normals[ i + 1 ] = ny;
					normals[ i + 2 ] = nz;

					normals[ i + 3 ] = nx;
					normals[ i + 4 ] = ny;
					normals[ i + 5 ] = nz;

					normals[ i + 6 ] = nx;
					normals[ i + 7 ] = ny;
					normals[ i + 8 ] = nz;

					// colors

					var vx = ( x / n ) + 0.5;
					var vy = ( y / n ) + 0.5;
					var vz = ( z / n ) + 0.5;

					color.setRGB( vx, vy, vz );

					colors[ i ]     = color.r;
					colors[ i + 1 ] = color.g;
					colors[ i + 2 ] = color.b;

					colors[ i + 3 ] = color.r;
					colors[ i + 4 ] = color.g;
					colors[ i + 5 ] = color.b;

					colors[ i + 6 ] = color.r;
					colors[ i + 7 ] = color.g;
					colors[ i + 8 ] = color.b;

				}

				geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

				geometry.computeBoundingSphere();

				var material = new THREE.MeshPhongMaterial( {
					color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
					side: THREE.DoubleSide, vertexColors: THREE.VertexColors
				} );

				mesh = new THREE.Mesh( geometry, material );
			//	scene.add( mesh );
				
/*
				var	ddata = generateHeight( worldWidth, worldDepth );


				geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
				geometry.rotateX( - Math.PI / 2 );
geometry.dynamic = true;

			    vertices = geometry.attributes.position.array;

				for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

					vertices[ j + 1 ] = ddata[ i ] * 1.4;

				}

				*/


				geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
				geometry.rotateX( - Math.PI / 2 );

				for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

					geometry.vertices[ i ].y = 35 * Math.sin( i / 2 );

				}
				var texture = new THREE.TextureLoader().load( "images/s.png" );

				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.set( 1,1 );

				mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map:texture} ) );
				mesh.position.set(1200, -6, 5000)
mesh.castShadow = true;

mesh.name = 'ice'
	mesh.receiveShadow = true;
	//	scene.add( mesh );



	// LIGHTS
/*




	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -1, 1.5, 0.5 );
	light.castShadow = true;
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xff0000, 5.5 );
	light.position.set( 1, 1.5, -0.5 );
	light.castShadow = true;
	scene.add( light );

	

	*/
	if(data.me.player_id){
		player_id 		=  data.me.player_id
	}
	
	player_color 	=  data.me.color
	player_name 	=  data.me.player_name

	c = data.game.world.room.objects.length
	document.getElementById("count").innerHTML = '<h1>'+c+' objects</h1>';
	document.getElementById("me").innerHTML = '<h1 style="color:'+player_color+';">your id:'+player_name+'</h1>';                   
	
	_.each(data.game.world.room.objects, function(o){
		console.log(o)

		if(player_id && o.player_id == player_id){
			console.log('isme')

				camera.position.z = o.z
				camera.position.x = o.x
				camera.lookAt( scene.position );

			var geometry = new THREE.CubeGeometry( 1, 1, 1 );
		}
		else{
			console.log('iselse')
			var k = 1
			var geometry = new THREE.CubeGeometry( k,4,k );

			// var geometry = new THREE.CubeGeometry( Math.floor(Math.random() * k), Math.floor(Math.random() * k), Math.floor(Math.random() * k) );
		}

		/// CCCC 
		
		var material = new THREE.MeshStandardMaterial( { color: o.color,  opacity: 1, transparent: true  });
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = o.x;
		mesh.position.y = o.y+2;
		mesh.position.z = o.z;
		mesh.name = o.player_id
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		console.log(mesh)
		scene.add( mesh );
	})




	renderer = new THREE.WebGLRenderer( { alpha: true } ); // init like this
	var op = Math.floor(Math.random() * 10) / 10
	renderer.setClearColor( 0x1e4687, op ); // second param is opacity, 0 => transparent




	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//	renderer.shadowMap.enabled = window.location.search === "";
	document.body.appendChild( renderer.domElement );
	//
//	effect = new THREE.CardboardEffect( renderer );
//	effect.setSize( window.innerWidth, window.innerHeight );
	//
	window.addEventListener( 'resize', onWindowResize, false );
//	navigator.geolocation.getCurrentPosition(gotPosition, showError, { enableHighAccuracy: true, maximumAge: 600000 });
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



function generateHeight( width, height ) {

				var size = width * height, data = new Uint8Array( size ), quality = 1, z = Math.random() * 100;

				for ( var j = 0; j < 4; j ++ ) {

					for ( var i = 0; i < size; i ++ ) {

						var x = i % width, y = ~~ ( i / width );
						data[ i ] += Math.abs(  Math.random(x / quality, y / quality, z) * quality * 0.08);

					}

					quality *= 6;

				}
			//	console.log(data)
				return data;

			}




