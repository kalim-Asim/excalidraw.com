import express from "express";

const app = express();


app.listen(5000, (err) => {
  console.log("http-server running on port 5000");
})