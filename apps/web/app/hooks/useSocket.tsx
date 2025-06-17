import { useState, useEffect } from "react";
import { WEBSOCKET_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
 // ws://localhost:8080/?token=123456
  useEffect(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0YjhmYmQwNS1mMDI1LTQyNDQtOTI1Mi1lMmVhYzIyNGUxYTkiLCJpYXQiOjE3NTAxNDYyNjN9.1M7-WtYi4s53gjnz0thUtJ7itbkKZzm-SHDBIerkclA`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    }
  }, []);

  return {
    socket, loading
  }
}