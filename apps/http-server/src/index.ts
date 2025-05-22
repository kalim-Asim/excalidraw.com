import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, SigninSchema, createRoomSchema} from "@repo/common/types";
const app = express();

app.post("/signup", (req, res) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid data", 
    })
    return;
  }
  const { username, password, name } = data.data;
});

app.post("/login", (req, res) => {
  
});

app.post("/room", middleware, (req, res) => {

});

app.listen(5000, (err) => {
  console.log("http-server running on port 5000");
})