// 3dcubes.js
var c;
var scene = document.querySelector('a-scene');
var  player_id
var  player_color;
var socket = io.connect();
       

socket.emit('load')
                      

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
  cam_move('sky')
});
key('k', function(){ 
  cam_move('ground')
});



 
function cam_move(dir){

    var cam = document.querySelector('a-camera')
    var campos = cam.getAttribute('position')
    var t = parseInt(campos.y-1)
    if(dir =='sky'){
      t= parseInt(campos.y+1)
    }
    cam.setAttribute('position', campos.x+' '+t+' '+campos.z);
}

function me_position(){
  var p = document.getElementById(player_id).getAttribute('position')
  return p
}


function me_build(){

  p = me_position()
  socket.emit('build', 
                  { 
                    player_id:player_id,
                   	build:{
                            type: 'cube',
                            x: p.x,
                            y: p.y,
                            z: p.z,
                    	    color:player_color
                           }
                             
                  }
      );
}

function me_move(dir){
        var m =  document.getElementById(player_id)
        var mep  = me_position()
  
        mep_x = mep.x
        mep_y = mep.y
        mep_z = mep.z
      

       if(dir == 'left'){
            mep_x = mep.x-1
       }
        if(dir == 'right'){
            mep_x = mep.x+1
       }
        if(dir == 'up'){
            mep_z = mep.z-1
       }

        if(dir == 'l'){
            mep_y = mep.y-1
       }

        if(dir == 'm'){
            mep_y = mep.y+1
       }

        if(dir == 'down'){
            mep_z = mep.z+1
       }

     
        m.setAttribute('position', mep_x+' '+mep_y+' '+mep_z);
        var cam = document.querySelector('a-camera')
        var campos = mep_x+' '+(mep_y+3)+' '+(mep_z+20);
        cam.setAttribute('position', campos);
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


function runCommand(t){
 
 
         document.getElementById("count").innerHTML = '<h1>'+c+'</h1>';

 


//   t.setAttribute('material', 'src: url(../_images/pill.jpg)');
}
socket.on('moveback', function (data) { 
              console.log('player_id:;'+data.player_id)

              var t = document.getElementById(data.player_id)

              if(t){
                  console.log('target moved')
                  t.setAttribute('position',+data.move.x+ ' '+data.move.y+' '+data.move.z);
              }
              else{
              console.log('target init +moved')
              var obj = document.createElement('a-entity');
              obj.setAttribute('geometry', 'primitive: box');
              obj.setAttribute('position',+data.move.x+ ' '+data.move.y+' '+data.move.z);
              obj.setAttribute('id',data.player_id);
              obj.setAttribute('material','color:'+data.move.color);
              scene.appendChild(obj);


              }
              //console.log(data.actions[0].test.oe)
})


// me or another player 'built' a new cube
socket.on('buildback', function (data) {       
	//console.log(data)
	var b = data.build
	var o_ = document.createElement('a-entity');
	o_.setAttribute('geometry', 'primitive: box');
	o_.setAttribute('position', b.x+' '+b.y+' '+b.z);
	o_.setAttribute('id',b.player_id);
	o_.setAttribute('material', 'color:'+b.color);
	c = data.game.world.room.objects.length
	document.getElementById("count").innerHTML = '<h1>'+c+' objects</h1>';
	scene.appendChild(o_);
})


socket.on('remove_player', function (data) { 
	console.log('player_left')
	var t = document.getElementById(data.player_id)
	scene.removeChild(t)
	c = c-1
})






socket.on('new_player', function (data) { 


  console.log('newplayer')
   c = c+1

   var o_ = document.createElement('a-entity');
                              o_.setAttribute('geometry', 'primitive: box');
                              o_.setAttribute('position', data.x+' '+data.y+' '+data.z);
                              o_.setAttribute('id',data.player_id);
                             o_.setAttribute('material','color:'+data.color);
                              scene.appendChild(o_);


         document.getElementById("count").innerHTML = '<h1>'+c+' players</h1>';


})



socket.on('loaded', function (data) { 
           
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
                              var o_ = document.createElement('a-entity');
                              o_.setAttribute('geometry', 'primitive: box');
                              o_.setAttribute('position', o.x+' '+o.y+' '+o.z);
                              o_.setAttribute('material', 'color:'+o.color);
                              o_.setAttribute('id',o.player_id);
                              scene.appendChild(o_);
                         })
                     


})


      
