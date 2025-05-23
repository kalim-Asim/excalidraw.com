import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, SigninSchema, createRoomSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import { bcrypt } from "bcrypt";
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

app.post("/signin", async (req, res) => {
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
        password
      }
    });
    if (!user) {
      res.json({
        message: "User not found",
      });
      return;
    }
    
    bcrypt.compare(password, user.password, (compareErr: Error | null, isMatch: boolean) => {
      if (compareErr || !isMatch) {
        return (res as Response).status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }
      // Passwords match, proceed with authentication
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

app.post("/room", middleware, (req, res) => {

});

app.listen(5000, (err) => {
  console.log("http-server running on port 5000");
})