import axios from 'axios';
import { BACKEND_URL } from '../../config';

async function getChatRoomId(slug: string) {
  const response = axios.get(`${BACKEND_URL}/room/${slug}`); 
  return (await response).data.id;
}

export default async function ChatRoom({
  params
} : {
  params: {
    slug : string;
  }
}) {
  const slug = params.slug;
  const roomId = await getChatRoomId(slug);
  
}