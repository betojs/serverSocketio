const io = require("socket.io"),
    server = io.listen(3001);

let sequenceNumberByClient = new Map();
    
let msj=[{_id:1, data:1}];
// event fired every time a new client connects:

console.log(`Esperando a algun cliente...`);

let tagLost = [{
    "taglost": "cc:50:e3:a9:8e:d6",
    "region": "angar centro",
    "piso": "sala"
  },{
    "taglost": "c4:2f:eb:44:2c:ea",
    "region": "",
    "piso": ""
  },{
    "taglost": "c8:64:46:ac:3a:18",
    "region": "angar centro",
    "piso": "sala"
  },{
    "taglost": "c4:04:ca:41:50:ad",
    "region": "Garaje",
    "piso": "Planta Baja"
  }]
  
let tagLowBattery=[
      {
          macTag:"c8:64:46:ac:3a:18",
          batteryLevel:  23
        },
      {
          macTag:"c4:04:ca:41:50:ad",
          batteryLevel:  30
        }
]
  let validator = false
  setInterval(() => {
    if(validator){
        server.emit('missing-Tag-Aalarm',{msg:'Danger no target is detected in the system', Tags:[]})
        validator= false
    }else{
        validator = true

        server.emit('missing-Tag-Aalarm',{msg:'the following tags are missing from the system',
        Tags:tagLost})
    }
    
}, 35000);

setInterval(() => {
    

    server.emit('alarm-low-batery', {
            ok:true,
            msg:'The following targets have batteries below 30%',
            tagLowBattery:tagLowBattery})

}, 60000);

setInterval(() => {
let RpisDisconnected =[ { macRpi: 'b8:27:eb:d4:04:c9',
region: 'angar derecho',
floor: 'Aadministrativos' } ]

    server.emit('gateway-Aalarm', {
            ok:true,
            msg:'Caution Gateways disconnected',
            gateways:RpisDisconnected})

}, 60000);

let sendAccion = (js)=>{
    console.log(js);
    
    
}

let stopped_caracter = ()=>{


    setTimeout(() => {

        let data = {aviso:'Finished'}
        server.emit('progressInfo',data)
        
    }, 10000);
}

let refresh =() =>{

    let actualiza=`Actualizar libreta del server`
    let etiqueta= {name:'c4:2f:eb:44:2c:ea'}
    console.log(actualiza);
    server.emit('refresh', actualiza)
    server.emit('Option-to-Validator', etiqueta)
}

let startTracking = (aviso) => {

    console.log(aviso);

    server.emit('asset-tracking', aviso);
}

let startValidation = async (aviso) => {

    let arr = []
    console.log(aviso);

    arr = [{
        id: 's5noiTvEkEggkXPOAAAA',
        tipo: 'validacion',
        mac: 'c4:2f:eb:44:2c:ea'
    },{
        id: 's5noiTvEkEggkXPOAAAB',
        tipo: 'validacion',
        mac: 'c4:2f:eb:44:2c:eb'
    },{
        id: 's5noiTvEkEggkXPOAAAC',
        tipo: 'validacion',
        mac: 'c4:2f:eb:44:2c:ec'
    }];

    if (arr.length === 3) {

        for (let i = 0; i < arr.length; i++) {
            console.log(`HAY 3 MACS ${arr[i].id}|| ${arr[i].mac}`);
            server.to(arr[i].id).emit('asset-tracking', aviso);
        }
    }


}


let stopped = () => {
    let aviso = 'detener el despliegue';
    console.log(aviso);

    server.emit('stopped-all', aviso);
}

server.on("connection", (socket) => {

    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);

    socket.on('prueba', (data) =>{
        let json={_id:socket.id, data}
        msj.push(json)
        console.log(`data: ${data}, id{${socket.id}}`);
        console.log(msj);
        if(msj.length >2){
            
            server.to(msj[2]._id).emit('hey', 'EPALE SEBAS!')
        }
    })

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
    //Actualiza la libreta que enlista los rpi conectados, y nos permite saber quien se conectó.
    socket.on('refresh-client', data=>{
        console.log(data);
        refresh();
    })

    socket.on('accions', data =>{
        console.log(`---`);
        console.log(data);
        console.log(`---`);
        for (let i = 0; i <( data.length - 1); i++) {
            
            let js={
                id:'socketId', //resul.socketID,
                distancia:data[i].distancia
            }
            sendAccion(js)
            
        }
        stopped_caracter()
    })

    socket.on('stop-all', data => {
        console.log(data);
        stopped();
    })

    socket.on('despliegue', async data => {

        console.log(data);
        if (data.tipo === 'validar') {
            startValidation(data)
        } else if (data.tipo === 'tracking') {
            startTracking(data)

        }

    })

});
// sends each client its current sequence number
setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("seq-num", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 1000);


/* *****************************************
*	CARACTERIZACION!
*	
/* *****************************************/


// (Send) Enviar datos par iniciar la recoleccion de muestras

// var distance = 1//document.getElementById('Distancia').value
// var array = [{ 
//     distancia: distance,//document.getElementById('Distancia').value, 
//     mac: 'c4:2f:eb:44:2c:ea', //document.getElementById('maclist1').value      
//   },{ 
//     distancia:distance,// document.getElementById('Distancia').value, 
//     mac: 'c4:2f:eb:44:2c:ea', //document.getElementById('maclist2').value
//   },{ 
//     distancia: distance, //document.getElementById('Distancia').value, 
//     mac: 'c4:2f:eb:44:2c:ea',//document.getElementById('maclist3').value
//   }, 
//   {sessionId:'asfasdasgfwqe31`2'}]; 

// socket.emit('accions', array)
