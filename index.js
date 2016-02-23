'use strict';


/*

minimal web server for cube game


*/

/**
 * Module dependencies.
 */

var express = require('express'),
nconf = require('nconf'), 
http = require('http'),  
chalk = require('chalk'),
_ = require('underscore');



nconf.argv().env().file({file:'config.json'});


var app = express();

 var game = {
        players: [], 
        world:{
            room : { 
                objects: []
            }
        }
    }

// {type:'cube', x:45, y:0, z:30, player_id:'iA0'}

app.all('*', function(req, res,next) {
    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});



app.set('port', nconf.get('API_SERVER_PORT'));
app.use(express.static(__dirname + '/client/public'))


var server =  http.createServer(app);
server.listen(app.get('port'),'192.168.1.2', function(){


   
  // Listening
  try {
    console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
    process.setgid('everyone');
    process.setuid('everyone');
    console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
  } catch (err) {
    console.log('Cowardly refusing to keep the process alive as root.');
    process.exit(1);
  }



    });




	var io =  require('socket.io').listen(server, {log:false, origins:'*:*'}, function(){
	  console.log(chalk.green('Hello io') );
	})


	io.on('connection', function (socket) {



	 console.log(chalk.green('connection IO') );
   console.log('socket into server '+app.get('API_SERVER_PORT'))



      socket.on('disconnect', function(){
                console.log('user disconnected');         
                var clean = []
                 _.each(game.world.room.objects, function(o){
                    if(o.player_id==socket.id){}
                    else{
                        clean.push(o)
                    }
                 })

                game.world.room.objects = clean;
                var data = {player_id:socket.id}
                socket.broadcast.emit('remove_player', data)
       });

    socket.on('load', function(){
        console.log('socket loader')
        console.log(socket.id)
        var pname = getRandNicename()

        var pcolor = getRandColor()

        var m =  {type:'cube', x:0, y:0, z:0, player_name: pname, player_id:socket.id, color: pcolor}
        game.world.room.objects.push(m)
        


        var back = {game:game, me: m}
        socket.emit('loaded', back )        
        socket.broadcast.emit('new_player',m)

        console.log('socket into server '+app.get('API_SERVER_PORT'))
    
    });
	 // socket.emit('news', { hello: 'world' });
	 socket.on('move', function(data){

        _.each(game.world.room.objects, function(o){
                if(data.player_id == o.player_id){
                    o.x = data.move.x
                    o.y = data.move.y
                    o.z = data.move.z
                }
        })
        socket.broadcast.emit('moveback', data)
	

    });


      socket.on('build', function(data){
        var b = {type:'cube', x:data.build.x, y:data.build.y, z:data.build.z, player_id:'iA0'+Math.round(Math.random()*10000), color: data.build.color }
        game.world.room.objects.push(b)
        
        var back = {build:b, game:game}
        socket.emit('buildback', back)
        socket.broadcast.emit('buildback', back)
    

    });

 })


    function getRandColor () {
          var letters = '0123456789ABCDEF'.split('');
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
      }


       function getRandNicename () {
          var words = [
          'bits', 'mem', 'core', 'patch', 'fix', 'loop', '9', 'alpha', '1', '42',
           'o', '1024', '2048' 
          ]
           var splits = [
          '+', '-', '/','|','_','-','#','=','==', '!','<','>','>>','<<', '&','@'
          ]
          var name = ''
          for (var i = 0; i < 3; i++) {
            var sw = Math.floor(Math.random() * 13);
            var ss = Math.floor(Math.random() * 16);

            if(words[sw]){
             name +=words[sw]
             words = _.without(words, words[sw])
            }
             if(splits[ss]){
             name +=splits[ss]
             splits = _.without(splits, splits[ss])
            }
           
          }
          return name;
      }



exports = module.exports = app;



