import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, SigninSchema, createRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

interface User {
  id: String;
  email: string;
  username: string;
  password: string;
}

interface JwtPayload {
  userId: number;
}

const app = express();
app.use(express.json());

app.post("/signup", async (req : Request, res : Response) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid data", 
    })
    return;
  }

  const { email, username, password } = data.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prismaClient.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword
      }
    });

    res.json({
      userId: user.id
    });
  }
  catch(err) {
    res.json({
      message: "User already exists",
    });
    return;
  }
});

app.post("/signin", async (req : Request, res : Response) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid data", 
    })
    return;
  }
  const { email, password } = data.data;
  
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      }
    });
    if (!user) {
      res.json({
        message: "User not found",
      });
      return;
    }
    
    bcrypt.compare(password, user.password, (err: Error | undefined, same: boolean) => {
      if (err || !same) {
        return (res as Response).status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
      //password is correct
      const token = jwt.sign({ 
        userId: user.id 
      }, JWT_SECRET);
      
      res.json({
        token
      });
  });
  } catch(err) {
    res.json({
      message: "User already exists",
    });
    return;
  }
});

app.post("/room", middleware, async (req, res) => {
  const data = createRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid data", 
    })
    return;
  }
  const userId = (req as any).userId; //middleware adds userId to request
  const { slug } = data.data;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: slug,
        adminId: userId
      }
    });

    res.json({
      roomId: room.id
    });
  } catch(err) {
    res.json({
      message: "Room already exists",
    });
    return;
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  // const userId = (req as any).userId;
  
  const chats = await prismaClient.chat.findMany({
    where: {
      roomId: roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 50 // top ke 50 messages
  });
  res.json({
    chats: chats
  });
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;

  const room = await prismaClient.room.findFirst({
    where: {
      slug: slug
    } 
  });
  res.json({
    room
  });
});

app.listen(5000, (err) => {
  console.log("http-server running on port 5000");
})