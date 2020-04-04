const io = require("socket.io-client"),
    ioClient = io.connect("http://192.168.8.101:3000");

// ioClient.on("seq-num", (msg) => console.info(msg));
// ioClient.on('hey', (data)=>console.log(data))
ioClient.emit("prueba", 'soy el cliente X');
// ioClient.on("hello", (data)=>console.log(data));
// ioClient.on("test", (data)=>console.log(data));


var distance = 1//document.getElementById('Distancia').value
var array = [{ 
    distancia: distance,//document.getElementById('Distancia').value, 
    mac: 'c4:2f:eb:44:2c:ea', //document.getElementById('maclist1').value      
  },{ 
    distancia:distance,// document.getElementById('Distancia').value, 
    mac: 'c4:2f:eb:44:2c:ea', //document.getElementById('maclist2').value
  },{ 
    distancia: distance, //document.getElementById('Distancia').value, 
    mac: 'c4:2f:eb:44:2c:ea',//document.getElementById('maclist3').value
  },{
    sessionId:'asfasdasgfwqe31`2'
  }]; 

  var stopObject = {
    aviso: 'detener el tracking desde client',
    sessionId: '32qRzDrOV12C0dxqMETlBuaa6XTuW6o9'
  };

  var tipo = "tracking";

  var startTrackingObject = {
    sessionId: '32qRzDrOV12C0dxqMETlBuaa6XTuW6o9',
    aviso: 'Inicio la Tracking',
    tipo: 'tracking'
  }
  var startValidationObject = { 
  aviso: 'Inicio la validacion',
  tipo: 'validar',
  region: '5e80141b6df27d34ac520dca',
  sessionId: '32qRzDrOV12C0dxqMETlBuaa6XTuW6o9'
 }

  if(tipo === "tracking"){
    objToSend = startTrackingObject;
  }else if( tipo === "validation"){
    objToSend = startValidationObject;
  }

  ioClient.emit('accions', array);

  ioClient.emit('despliegue', objToSend);

  ioClient.emit('stop-all', stopObject);

  ioClient.on('progressInfo',data=>console.log(data))

  ioClient.on('asset-tracking',tracking=> console.log(tracking))

  ioClient.on('stopped-all',stopped=> console.log(stopped))

  ioClient.on('refresh', actualiza=> console.log(actualiza))


  setTimeout(() => {
    let aviso={aviso:'Actualizar data del Server', sessionId:'qwefwfe'}
    ioClient.emit('refresh-client', aviso); 
  }, 5000);