var socket  = require( 'socket.io' );
var express = require( 'express' );
var app     = express();
var server  = require( 'http' ).createServer( app );
var io      = socket.listen( server );
var port    = process.env.PORT || 6453; // 6453 Puerto
var usuarios = [];

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

io.on('connection', function ( socket ) {

	socket.on('update_list', function( data )
	{				
		if(String(data.action) == 'login')
		{
			var user = { idSocket: socket.id, id: data.id, usuario: data.usuario };
			
			// Guardar usuario en el arreglo de las sesiones del chat
			if(typeof usuarios[fnFindUser(data.id)] === 'undefined')
			{
				usuarios.push(user);
			}
			else
			{
				usuarios[fnFindUser(data.id)] = user;
			}
		}
		else
		{
			// Borrar al usuario de las sesiones
			var index = fnFindUser(data.id);
			
			if (index > -1) 
			{
				usuarios.splice(index, 1);
			}
		}
		
		io.emit('session_update', usuarios.sort(fncompare), socket.id );
		
	});

	socket.on('private_message', function ( data ) {
		
		socket.broadcast.to(data.to).emit('private_message', { 
			msg_time: new Date().getTime(),
			from: data.from,
			to: data.to,
			msg: data.msg
		});
	});
  
});

function fnFindUser(id)
{
	for(var i = 0; i < usuarios.length; i++)
	{
		var u = usuarios[i];
		if(u.id == id)
			return i;
	}
	
	return -1;
}

function fncompare(a, b) 
{
  if (a.nombre < b.nombre)
    return -1;
  else if (a.nombre > b.nombre)
    return 1;
  else 
    return 0;
}


