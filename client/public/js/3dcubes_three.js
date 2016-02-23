
var c;
var  player_id
var  player_color;
var socket;
var camera, scene, renderer;
var effect;

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
				//camera.position.x = Math.cos( time ) * 4;
				//camera.position.z = Math.sin( time ) * 4;
				camera.lookAt( new THREE.Vector3() );

				effect.render( scene, camera );

			}



socket.on('loaded', function (data) { 





				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100 );
				camera.position.set( 3, 2, 3 );
				camera.lookAt( new THREE.Vector3() );
				camera.focalLength = camera.position.distanceTo( new THREE.Vector3() );

				scene = new THREE.Scene();

				
				/*
				var geometry = new THREE.PlaneGeometry( 4, 4 );
				geometry.rotateX( - Math.PI / 2 );
				var material = new THREE.MeshStandardMaterial();
				var mesh = new THREE.Mesh( geometry, material );
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				scene.add( mesh );

				*/

				var light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( -1, 1.5, 0.5 );
				light.castShadow = true;
				scene.add( light );

				var light = new THREE.DirectionalLight( 0xff0000, 1.5 );
				light.position.set( 1, 1.5, -0.5 );
				light.castShadow = true;
				scene.add( light );

				//

			







           
                        player_id 		= data.me.player_id
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


                               var geometry = new THREE.CubeGeometry( 1, 1, 1 );
								var material = new THREE.MeshStandardMaterial();
								var mesh = new THREE.Mesh( geometry, material );
								mesh.position.x = o.x;
								mesh.position.y = o.y;
								mesh.position.z = o.y;


								mesh.castShadow = true;
								mesh.receiveShadow = true;
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


					animate();
                     


})




