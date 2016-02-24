


var app = angular.module('compass', [])
.controller('CompassCtrl', ['$scope', '$interval' ,function($scope, $interval) {
	
	// THREE

//	$( document ).ready(function(){



// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables

var MovingCube,  MovingCubeB;

 		




function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}


function update()
{
	var delta = clock.getDelta(); // seconds.
	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
//	console.log($scope.orientation)
	
	// local coordinates

	// local transformations

	// move forwards/backwards/left/right
	if ( keyboard.pressed("W") )
		MovingCube.translateZ( -moveDistance );
	if ( keyboard.pressed("S") )
		MovingCube.translateZ(  moveDistance );
	if ( keyboard.pressed("Q") )
		MovingCube.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		MovingCube.translateX(  moveDistance );	


	var flax = ($scope && $scope.orientation && $scope.orientation.alpha) ? ($scope.orientation.alpha * Math.PI / 180) : 0
	var flay = ($scope && $scope.orientation && $scope.orientation.beta) ? ($scope.orientation.beta * Math.PI / 180) : 0
	var flaz = ($scope && $scope.orientation && $scope.orientation.gamma) ? ($scope.orientation.gamma* Math.PI / 180) : 0
	MovingCube.rotation.set(flay, flax,flaz);
//MovingCube.scale.x = MovingCube.scale.x+0.01;

	// rotate left/right/up/down
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( keyboard.pressed("A") )
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
		//	MovingCube.scale.x = (MovingCube.scale.x)*2;


		
	if ( keyboard.pressed("D") )
		
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	if ( keyboard.pressed("R") )
		MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	if ( keyboard.pressed("F") )
		MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	
	if ( keyboard.pressed("Z") )
	{
		MovingCube.position.set(0,25.1,0);
		MovingCube.rotation.set(0,0,0);
	}
		
	// global coordinates
	if ( keyboard.pressed("left") )
		MovingCube.position.x -= moveDistance;
	if ( keyboard.pressed("right") )
		MovingCube.position.x += moveDistance;
	if ( keyboard.pressed("up") )
		MovingCube.position.z -= moveDistance;
	if ( keyboard.pressed("down") )
		MovingCube.position.z += moveDistance;
		
	controls.update();
	stats.update();
}

function render() 
{
	renderer.render( scene, camera );
}





var init = function()
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,800);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'three/lib/lib/images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	//scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x3333ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	
	////////////
	// CUSTOM //
	////////////
	
	// create an array with six textures for a cool cube
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/grass-512.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/grass-512.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/grass-512.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/grass-512.jpgg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/zneg.png' ) }));
	var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
	var MovingCubeGeom = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1, materialArray );
	MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
	MovingCube.position.set(0, 25.1, 0);
	scene.add( MovingCube );


	// create an array with six textures for a cool cube
	var materialArrayB = [];
	materialArrayB.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/xpos.png' ) }));
	materialArrayB.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/xneg.png' ) }));
	materialArrayB.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/ypos.png' ) }));
	materialArrayB.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/yneg.png' ) }));
	materialArrayB.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/zpos.png' ) }));
	materialArrayB.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'three/lib/lib/images/zneg.png' ) }));
	var MovingCubeMatB = new THREE.MeshFaceMaterial(materialArrayB);
	var MovingCubeGeomB = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1, materialArrayB );
	MovingCubeB = new THREE.Mesh( MovingCubeGeomB, MovingCubeMatB );
	MovingCubeB.position.set(100, 25.1, 0);
	//scene.add( MovingCubeB );


	
}
init()
animate();




//})
console.log('angular ready')
	//$scope.store = Rhaboo.persistent('psddd');

	$scope.$watch('geo.has_', function(newValue, oldValue) {
			if(newValue){
				//$scope.getSunTime()
			
			}
	})
/*
	$scope.$watch('geo.lat', function(newValue, oldValue) {
			if(newValue){
				alert('lat chang'+newValue)
			
			}
	})
	$scope.$watch('geo.lon', function(newValue, oldValue) {
			if(newValue){
				alert('lonchang'+newValue)
			
			}
	})
	*/
	$scope.getSunTime = function(){
		
		// https://github.com/mourner/suncalc
			var times = SunCalc.getTimes(createDateAsUTC(new Date()), $scope.geo.lat,$scope.geo.lon);


			console.log(times)

 		    $interval( function(){ 


 		    	$scope.geo.time = {
					'h':moment().utc().format('HH'),
					'm':moment().utc().format('mm'),
					's':moment().utc().format('ss'),
					'y':moment().utc().format('YYYY'),
					'ee':moment().utc().format('DD'),
					'pp':moment().utc().format('MM')
				}


				if(parseInt($scope.geo.time.h)<8){
				//	console.log('night')
				}
				else{
				//	console.log('not night')
				//	console.log(parseInt($scope.geo.time.h))
				}
				$scope.geo.time.sunrise = createDateAsUTC(times.sunrise)
				$scope.geo.time.sunset =  createDateAsUTC(times.sunset)
 		   		 $scope.nowTime = createDateAsUTC(new Date());  
 		    	$scope.nowTime_display = moment().format('HH:mm:ss' ); 


			


			$scope.geo.time.sunrise = moment($scope.geo.time.sunrise)
			$scope.geo.time.sunset  = moment($scope.geo.time.sunset)



			$scope.geo.time.sunrise_display  = moment($scope.geo.time.sunrise).format('HH:mm:ss')
			$scope.geo.time.sunset_display  = moment($scope.geo.time.sunset).format('HH:mm:ss')


			$scope.pre_midnight = moment($scope.geo.time.y+'-'+$scope.geo.time.pp+'-'+$scope.geo.time.ee+' 0:00:01','YYYY-MM-DD HH:mm:ss');
			$scope.pre_midnight = createDateAsUTC(new Date($scope.pre_midnight))


			$scope.night_midnight = moment($scope.geo.time.y+'-'+$scope.geo.time.pp+'-'+$scope.geo.time.ee+' '+23+':'+59+':'+59,'YYYY-MM-DD HH:mm:ss');
			$scope.night_midnight = createDateAsUTC(new Date($scope.night_midnight))

	
			
			// moment plugin , return h->0,m->1,s->2 [array]
			


			$scope.geo.time.length_ = moment.preciseDiff($scope.geo.time.sunrise  , $scope.geo.time.sunset  );
			
			$scope.geo.time.length = {
				'day': 24*3600,
				'halfday': 12*3600,
				'h': $scope.geo.time.length_[0],
				'm': $scope.geo.time.length_[1],
				's': $scope.geo.time.length_[2],
			}


			$scope.geo.time.length.day_total_secondes = ($scope.geo.time.length.h*3600)+ ($scope.geo.time.length.m*60) +($scope.geo.time.length.s)
			$scope.geo.time.length.night_total_secondes = $scope.geo.time.length.day - 	$scope.geo.time.length.day_total_secondes


			$scope.geo.time.since_midnight = moment.preciseDiff($scope.geo.time.sunrise, $scope.pre_midnight );
			$scope.geo.time.since_midnight_seconds = parseInt($scope.geo.time.since_midnight[0]*3600)+parseInt($scope.geo.time.since_midnight[1]*60)+parseInt($scope.geo.time.since_midnight[2])
			$scope.geo.time.since_midnight_ratio = Math.round( $scope.geo.time.since_midnight_seconds  / $scope.geo.time.length.day *100)+'.0%'

			$scope.geo.time.till_midnight = moment.preciseDiff($scope.geo.time.sunset, $scope.night_midnight );
			$scope.geo.time.till_midnight_seconds = parseInt($scope.geo.time.till_midnight[0]*3600)+parseInt($scope.geo.time.till_midnight[1]*60)+parseInt($scope.geo.time.till_midnight[2])
			$scope.geo.time.till_midnight_ratio = Math.round( $scope.geo.time.till_midnight_seconds  / $scope.geo.time.length.day *100)+'.0%'

			$scope.geo.time.day_ratio = 100 - Math.round( $scope.geo.time.till_midnight_seconds  / $scope.geo.time.length.day *100) - Math.round( $scope.geo.time.since_midnight_seconds  / $scope.geo.time.length.day *100)+'.0%'

			$scope.geo.time.nights_seconds = $scope.geo.time.since_midnight_seconds + $scope.geo.time.till_midnight_seconds
			$scope.geo.time.nights_ratio=  Math.round( $scope.geo.time.nights_seconds  / $scope.geo.time.length.day *100)+'.0%'

			$scope.geo.time.meridien_percent = Math.round( parseInt(($scope.geo.time.length.day_total_secondes/2)+$scope.geo.time.since_midnight_seconds)  / $scope.geo.time.length.day  *100)+'.1%'



			$scope.geo.time.night = {
				'total_secondes': $scope.geo.time.length.day - $scope.geo.time.length.day_total_secondes,
				'since_midnight': 'dd'

			}

			

			//var m2 = moment(times.sunset,'YYYY-MM-DD HH:mm:ss');
			// moment plugin , return h->0,m->1,s->2 [array]
			//$scope.geo.time.length_ = moment.preciseDiff(sunriseTime, sunsetTime);


		
			$scope.geo.time.var_sd =   $scope.geo.time.length.halfday / $scope.geo.time.length.day_total_secondes 
			$scope.geo.time.var_nd =  $scope.geo.time.length.halfday / $scope.geo.time.night.total_secondes 

			// $scope.geo.time.since =  $scope.geo.time.length.halfday / $scope.geo.time.length.night_total_secondes 


			$scope.geo.time.now_secondes = parseInt($scope.geo.time.h*3600)+parseInt($scope.geo.time.m*60)+parseInt($scope.geo.time.s)
			//
			
			//	for css
			$scope.geo.time.now_secondes_percent = Math.round($scope.geo.time.now_secondes  / $scope.geo.time.length.day  *100)+'.0%'
			
			// for display
			$scope.geo.time.now_secondes_percent_exact = $scope.geo.time.now_secondes  / $scope.geo.time.length.day  *100+'%'


			// $scope.geo.time.now_geo_time = $scope.geo.time.now_secondes 



		//	console.log($scope.geo)

			// $scope.$digest();

			

			}, 1000);
	}

	$scope.colophon = false

	$scope.toogle_colophon = function(){
		$scope.colophon = !$scope.colophon
	}
	
	$scope.geo = {'has_':false, 'pass':0}


	var can_geo = false
    if (navigator.geolocation) {
    	can_geo = true

    } else {
      
    }


    var prevG = 0;

    $interval( function(){ 

		    	 navigator.geolocation.getCurrentPosition(gotPosition, showError, { enableHighAccuracy: true, maximumAge: 600000 });
		    	

        }, 1000);



 // orientation things
 var orientation_ = {'alpha':70, 'beta':40, 'gamma':50}
 $scope.orientation = orientation_ 

 window.addEventListener('deviceorientation', function(event) {

  orientation_ = event
}, false);

	$interval( function(){ 

	  $scope.orientation.alpha	= Math.floor(orientation_.alpha)
	  $scope.orientation.beta	=  Math.floor(orientation_.beta)
	  $scope.orientation.gamma	=  Math.floor(orientation_.gamma)
	  $scope.orientation.flat_x	=  ( Math.abs(Math.floor(orientation_.beta)) < 3)  ? true : false
	  
	  	
	 	if(  Math.abs(Math.floor(orientation_.gamma)) >= 10 ){
	 		


	 		
	 		 if( Math.floor(orientation_.gamma) <= 10  ){
	 			$scope.orientation.flat_y	= 'left'
	 		}
	 		 if( Math.floor(orientation_.gamma) >= 10  ){
	 			$scope.orientation.flat_y	= 'right'
	 		}


	 	}
	 	
	 	else{
	 		$scope.orientation.flat_y	= 'flat'
	 	}
	 	


	  $scope.orientation.flat_north	=  ( Math.abs(Math.floor(orientation_.alpha)) < 3)  ? true : false

	  $scope.compass =  '-webkit-transform:rotateX('+$scope.orientation.beta+'deg) rotateY('+$scope.orientation.alpha+'deg) rotateZ('+$scope.orientation.gamma+'deg);';
	  $scope.compass_alpha =  '-webkit-transform:rotateZ('+$scope.orientation.alpha+'deg); transform:rotateZ('+$scope.orientation.alpha+'deg);';
	  $scope.compass_beta =  '-webkit-transform:rotateZ('+$scope.orientation.beta+'deg); transform:rotateZ('+$scope.orientation.beta+'deg);';
	  $scope.compass_gamma =  '-webkit-transform:rotateZ('+$scope.orientation.gamma+'deg); transform:rotateZ('+$scope.orientation.gamma+'deg);';
	//  
/*
	if(!$scope.store.orientation){
		// $scope.store.write('orientation', new Array($scope.orientation.gamma));
		 console.log($scope.store)
	}
	*/


 }, 10);


$interval( function(){ 

	
if($scope.store && $scope.store.orientation && $scope.orientation){
	console.log('has strore')
//	var ttt = new Array($scope.store.orientation)
//	ttt.push()
//	$scope.store.write('orientation', Math.random());

	}
else{
		console.log('has no strore')
	//o = new Array($scope.orientation.gamma)
}

//$scope.store.write('orientation', o);


console.log('timer 3s '+$scope.orientation.gamma)


}, 3000)





    function showError(){
    		console.log('error lat/lon')
    }
    function createDateAsUTC(date) {
  	  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    }

	function convertDateToUTC(date) { 
  	  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }
	function gotPosition(position) {
			$scope.geo.lat = position.coords.latitude
			$scope.geo.lon = position.coords.longitude
			$scope.geo.has_ = true
			$scope.geo.pass++;

		  	// $scope.store.write('geo',  position.coords.latitude);

			
			$scope.$digest();

			//return $scope.geo
	}







	
/*

$scope.last = '200'
$scope.myStyle = {'transform':'rotate('+$scope.last+'deg)', '-webkit-transform':'rotate('+$scope.last+'deg)'} 

 $scope.callAtInterval = function() {
	   

 			if(!store.positions){
				$scope.positions = new Array()
			//	store.write('positions', $scope.positions);

			}
			else{
				$scope.positions = store.positions
			}
      
         		var d = new Date();
				$scope.positions.push($scope.last+'-----'+d)
		//		store.write('positions', $scope.positions);

				$scope.myStyle = {'transform':'rotate('+$scope.last+'deg)', '-webkit-transform':'rotate('+$scope.last+'deg)'} 



    }

    $interval( function(){ $scope.callAtInterval(); }, 3000);



			
*/





}])




