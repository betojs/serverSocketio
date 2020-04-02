const
    io = require("socket.io-client"),
    ioClient = io.connect("http://192.168.0.101:3000");

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
  }, 
  {sessionId:'asfasdasgfwqe31`2'}]; 

  ioClient.emit('accions', array)

  ioClient.on('progressInfo',data=>console.log(data))


  ioClient.on('refresh', actualiza=> console.log(actualiza))


  setTimeout(() => {
    let aviso={aviso:'Actualizar data del Server', sessionId:'qwefwfe'}
    ioClient.emit('refresh-client', aviso); 
  }, 5000);