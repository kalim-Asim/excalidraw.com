import WebSocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import {prismaClient} from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws : WebSocket;
  rooms : string[];
  userId : string;
}

const users: User[] = []

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') {
      return null;
    }
    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId as string;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}

wss.on('connection', (ws: WebSocket, request) => {
  const url = request.url; // --> ws://localhost:8080/?token=123456
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);
  if (!userId) {
    ws.close();
    return null;
  }

  ws.on('message', async (message: string) => {
    const parsedData = JSON.parse(message as unknown as string); 

    if (parsedData.type === 'join') {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === 'leave') {
      const user = users.find(x => x.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
    }

    console.log("message received" + parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        }
      });

      const to_send = JSON.stringify({
        type: "chat",
        message: message,
        roomId
      });
      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(to_send)
        }
      })
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');