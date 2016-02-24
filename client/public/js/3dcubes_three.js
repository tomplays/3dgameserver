
var c;
var  player_id
var  player_color;
var socket;
var camera, scene, renderer,light;
var effect;



function gotPosition(position) {


	// top north : 48.8985587  2.3592401,21
	// south = 	   48.8194131  2.3446799,21
	// E     	   48.8415116  2.2531099,20
	// W     	   48.8541586  2.4141059,20



var l_ = 8806.042
var lg = 3830.294

		//	var l = position.coords.latitude
			//var L = position.coords.longitude
  		 var m =  scene.getObjectByName(player_id);

       
   
        m.position.x = lg
        
        m.position.z =   l_;
	}


	function showError(){

	}



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

   	light.position.set( mep_x, mep_y,mep_z );


     //   camera.position.set( mep_x, mep_x, mep_z);

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




			init();
	

			function init() {
		socket = io.connect();
				socket.emit('load')

			

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
    		    camera.position.set( mep.x-5, mep.y+1200, mep.z-6);

				effect.render( scene, camera );


			}



socket.on('loaded', function (data) { 





				camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.set( 0, 0, 0 );
				camera.lookAt( new THREE.Vector3(0,0,0) );
				//camera.focalLength = camera.position.distanceTo( new THREE.Vector3() );

				scene = new THREE.Scene();

				
			
				var geometry = new THREE.PlaneGeometry( 4000, 4000 );
				geometry.rotateX( - Math.PI / 2 );
				var material = new THREE.MeshStandardMaterial();
				var mesh = new THREE.Mesh( geometry, material );
				mesh.castShadow = true;
				mesh.receiveShadow = true;
	scene.add( mesh );
//
				
				var light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( -1, 1.5, 0.5 );
				light.castShadow = true;
				scene.add( light );

			var light = new THREE.DirectionalLight( 0xff0000, 1.5 );
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
                              /*
                              var o_ = document.createElement('a-entity');
                              o_.setAttribute('geometry', 'primitive: box');
                              o_.setAttribute('position', o.x+' '+o.y+' '+o.z);
                              o_.setAttribute('material', 'color:'+o.color);
                              o_.setAttribute('id',o.player_id);
                              scene.appendChild(o_);
                              */
                         })

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0x101010 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = window.location.search === "";
				document.body.appendChild( renderer.domElement );

				//

			effect = new THREE.CardboardEffect( renderer );
			effect.setSize( window.innerWidth, window.innerHeight );

				//

				window.addEventListener( 'resize', onWindowResize, false );
				navigator.geolocation.getCurrentPosition(gotPosition, showError, { enableHighAccuracy: true, maximumAge: 600000 });


					animate();
                     


})

socket.on('moveback', function (data) { 
	console.log('player_id:;'+data.player_id)

	var t = scene.getObjectByName(data.player_id)

	if(t){
	  console.log('target moved')
	  t.position.set(data.move.x,data.move.y,data.move.z);
	}
	else{
			console.log('target init +moved')
		var o = data.move
		var geometry = new THREE.CubeGeometry( 1, 1, 1 );
		var material = new THREE.MeshStandardMaterial( { color: data.move.color });
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



socket.on('buildback', function (data) {       
	//console.log(data)
	var o = data.build
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

socket.on('new_player', function (data) { 
  	console.log('newplayer')
   	c = c+1
	var o = data
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





socket.on('remove_player', function (data) { 
	console.log('player_left')
	var t =  scene.getObjectByName(data.player_id)
	scene.remove(t)
	c = c-1
	document.getElementById("count").innerHTML = '<h1>'+c+' players</h1>';

})


