const
    io = require("socket.io-client"),
    ioClient = io.connect("http://192.168.0.101:3000");

// ioClient.on("seq-num", (msg) => console.info(msg));
// ioClient.on('hey', (data)=>console.log(data))
ioClient.emit("prueba", 'soy el cliente X');
ioClient.on("hello", (data)=>console.log(data));
ioClient.on("test", (data)=>console.log(data));