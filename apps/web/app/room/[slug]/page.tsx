import React from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { ChatRoom } from '../../components/ChatRoom';

async function getChatRoomId(slug: string){
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`); 
  return response.data.room.id;
}

export default async function ChatRoom1({params} : {
  params: {
    slug : string;
  }
}) {
  const slug = (await params).slug;
  const roomId = await getChatRoomId(slug);
  // console.log("Room ID:", roomId);
  // console.log(typeof roomId);
  return (
    <ChatRoom roomId={roomId}></ChatRoom>
  )
}