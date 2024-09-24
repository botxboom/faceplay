import { NextApiResponse } from "next";
import { Socket as NetSocket } from "net";
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io: SocketIOServer;
    };
  };
};
