import http from "http";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";

import router from "./routers";

const PORT = 3000;
const MongoDB =
  "mongodb+srv://abhijat789:abhijat789@cluster0.rmvh3lf.mongodb.net/?retryWrites=true&w=majority";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.Promise = Promise;
mongoose.connect(MongoDB);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("Server listening on port " + PORT + " http://localhost:3000/");
});
app.use("/", router());
