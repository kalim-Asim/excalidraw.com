"use client";

import { useSocket } from "../hooks/useSocket";
import { useState, useEffect } from "react";

export function ChatRoomClient({
  messages,
  roomId
} : {
  messages: {message: string}[];
  roomId: number;
}) {

  const {socket, loading} = useSocket();
  const [chats, setChats] = useState(messages);
  const [curMessage, setCurMessage] = useState("");
  
  useEffect(() => {
    if (socket && !loading) {
      socket.send(JSON.stringify({
        type: "join",
        roomId: roomId.toString()
      }));

      const handler = (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats(c => [...c, { message: parsedData.message }]);
        }
      };

      socket.addEventListener("message", handler);

      return () => {
        socket.removeEventListener("message", handler);
      };
    }
  }, [socket, loading, roomId]);


  return (
    <div>
      <h1>Chat Room {roomId}</h1>
      <ul>
        {chats.map((msg, index) => (
          <li key={index}>
            <strong>{msg.message}</strong>
          </li>
        ))}
      </ul>
      <input 
        type="text" 
        value={curMessage} 
        onChange={(e) => setCurMessage(e.target.value)} 
        placeholder="Type a message" 
      ></input>

      <button onClick={() => {
        if (socket && curMessage.trim()) {
          socket.send(JSON.stringify({
            type: "chat",
            roomId: roomId.toString(),
            message: curMessage
          }));
          setChats(c => [...c, { message: curMessage }]); // local echo
          setCurMessage("");
        }
      }}>
        Send
      </button>
    </div>
  );
}