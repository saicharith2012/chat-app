// What the user can send
// Join a room
// {
//    "type": "join",
//    "payload": {
//      "roomId": "123"
//    }
// }
// ​
// Send a message
// {
// 	"type": "chat",
// 	"payload": {
// 		"message: "hi there"
// 	}
// }

// What the server can send/User receives
// Message
// {
// 	"type": "chat",
// 	"payload": {
// 		"message": "hi there"
// 	}
// }

import { WebSocketServer, WebSocket } from "ws";

interface CustomWebSocket extends WebSocket {
  currentRoomId?: string;
}

const wss = new WebSocketServer({ port: 8080 });

// segregating sockets into separate rooms.
let allSockets: Record<string, CustomWebSocket[]> = {};

// new socket gets created for every new connection.
wss.on("connection", (socket: CustomWebSocket) => {
  socket.on("error", console.error);

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    // joining a room - add the new socket to a new room
    if (parsedMessage.type === "join") {
      const roomId = parsedMessage.payload.roomId;
      socket.currentRoomId = roomId;

      !allSockets[roomId] && (allSockets[roomId] = []);
      allSockets[roomId].push(socket);
      // console.log(allSockets);
    }

    // sending a message - send the message to all sockets of the room
    if (parsedMessage.type === "chat") {
      if (!socket.currentRoomId) {
        return;
      }

      allSockets[socket.currentRoomId].forEach((s) => {
        s.send(parsedMessage.payload.message);
      });
    }
  });
});
