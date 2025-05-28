import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;

let allSockets: WebSocket[] = [];

// new socket gets created for every new connection.
wss.on("connection", (socket) => {
  allSockets.push(socket);
  userCount++;
  const currentUser = userCount;
  console.log(`user #${userCount} connected.`);

  socket.on("error", console.error);

  socket.on("message", (data) => {
    console.log(`Received from user ${currentUser}: ${data} `);
    setTimeout(() => {
      console.log(allSockets.length)
      // broadcasting to all the clients
      allSockets.forEach((socket) => {
        socket.send(`${data} : received from the server.`);
      });
    }, 1000);
  });


  socket.on("close", () => {
    allSockets = allSockets.filter(s => s != socket)
    console.log(allSockets.length)
  })

  socket.send("Welcome to the chat...");
});
