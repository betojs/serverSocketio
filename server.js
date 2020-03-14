const
    io = require("socket.io"),
    server = io.listen(3000);

let
    sequenceNumberByClient = new Map();
    
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
            tagLowBattery})

}, 60000);

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
});
// sends each client its current sequence number
setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("seq-num", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 1000);