import express from "express";
import shodan, { ShodanDTO } from "./services/shodan";

const server = express();

server.post("/shodan", (req, res) => {
  const domain = req.body.domain;
  const shodanDTO = new ShodanDTO({
    domain,
    hosts: []
  });
  req.body.hosts.forEach((x: any) => {
    shodanDTO.hosts.push({
      domain,
      hostname: x.hostname,
      ipAddress: x.ipAddress,
      lastSeen: new Date()
    });
  });
  res.send(shodan(shodanDTO));
});

export default server;
