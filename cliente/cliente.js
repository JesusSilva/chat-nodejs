var socketId;
var usuarios = [];
var urlSocket = 'http://127.0.0.1:6453/';

$(document).ready(function(){
	
});

// Socket.IO

var socket = io.connect( urlSocket );

// Usuario que se conecta al Chat
socket.emit('update_list', { id: '1', usuario: 'Antonio', action: 'login' });

socket.on('session_update', function(data, socket){
	socketId = socket;
	usuarios = data;
	
	// Lista de usuarios conectados
	console.log(usuarios);
}); 

socket.on('private_message', function  ( data ) {
	console.log(data.msg_time + " F: " + data.from + " T: " + data.to + " M: " + data.msg);

	notifyMe(data.msg);
	$('#notif_audio')[0].play();
});

function enviarMensaje(to, msg)
{
	socket.emit('private_message', { from: socketId, to: to, msg: msg });
}

// Funcion para notificar
function notifyMe(mensaje) 
{
  if (!("Notification" in window)) 
  {
    alert("This browser does not support desktop notification");
  }

  else if (Notification.permission === "granted") 
  {
	var options = { body: mensaje };
	  
    var notification = new Notification("Nuevo Mensaje!", options);
  }

  else if (Notification.permission !== 'denied') 
  {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") 
	  {
		var options = { body: mensaje };
		
        var notification = new Notification("Nuevo Mensaje!", options);
      }
    });
  }
}

Notification.requestPermission();
