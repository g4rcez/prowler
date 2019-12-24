import express from "express";
import shodan from "./services/shodan";

const server = express();

server.post("/", (req, res) => {
  res.send(shodan(req.body));
});

export default server;
