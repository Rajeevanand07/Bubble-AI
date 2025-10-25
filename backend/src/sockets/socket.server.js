const { Server } = require("socket.io");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}

module.exports = initSocketServer;
