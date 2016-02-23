 
var io = require('socket.io-client');
var request = require('request');
var _ = require("underscore");

var nconf = require('nconf');
//var Xray = require('x-ray');
//var x = Xray();

nconf.argv().env().file({file:'config.json'});


var server_url = nconf.get('ROOT_URL')+':'+nconf.get('API_SERVER_PORT')
console.log('connecting to :'+server_url)
var socket = io.connect(server_url); 

var sh = require('sh');


							var simul_section_start		= 0
							var simul_section_end 		= 100
							var simul_qty		= 1
							var simul_markup_start = 3
							var simul_markup_end = 8
							
							var simul_range_start = 0
							var simul_range_end  =  0
							var pass = 0

							var limit = 15
							var count= 0


function simul(){



}




						function set_loop(){
							pass = pass+1
							simul_range_start = pass
							simul_qty = simul_qty+2	
							count= 0

						}



							
function runner(socket){




					var myVar =	setInterval(function(){ 
						console.log(data)

						if(data.me.x> 10){
							data.me.x = 0 
						}
						if(data.me.y> 10){
							data.me.y = 0 
						}
						if(data.me.z> 4){
							data.me.z = 0 
						}
						data.me.x = parseInt(data.me.x)+1
						data.me.y = parseInt(data.me.y)+1
						data.me.z = parseInt(data.me.z)+1

						 socket.emit('move',{ 
                   				 player_id:data.me.player_id,
				                 move : {
				                 				x: data.me.x,
				                                y: data.me.y,
				                                z: data.me.z,
				                                color: data.me.player_color
				                        
				                              }
                         
                        
                  			}
      						);

							

						 }, 100);
}
var data
socket.on('loaded', function (d) { 
	console.log(d)
	data = d
   	runner(socket);
});

socket.on('connect', function () { 
	console.log('connected')
	socket.emit('load');
   // runner(socket);
});


