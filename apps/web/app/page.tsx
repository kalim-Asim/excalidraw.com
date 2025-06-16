"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div>
      <input 
        type="text" value={roomId} onChange={(e) => {
          setRoomId(e.target.value);
        }} placeholder="Room ID"
      />
      <button onClick={() => {
        router.push(`/room/${roomId}`);
      }}>
        Join Room
      </button>
    </div>
  );
}
