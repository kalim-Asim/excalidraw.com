import WebSocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket, request) => {
  const url = request.url; // ws://localhost:8080/?token=123456
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }

  ws.on('message', (message: string) => {
    ws.send(`pong`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');