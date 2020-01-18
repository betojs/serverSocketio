const
    io = require("socket.io"),
    server = io.listen(3000);

let
    sequenceNumberByClient = new Map();
    
let msj=[{_id:1, data:1}];
// event fired every time a new client connects:
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