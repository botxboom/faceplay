"use client";

import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Lobby() {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);
  const [idToCall, setIdToCall] = useState("");
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");

  useEffect(() => {
    setMyUniqueId(Math.random().toString(36).substring(2));
  }, []);

  useEffect(() => {
    if (myUniqueId) {
      let peer: Peer;
      if (typeof window !== "undefined") {
        peer = new Peer(myUniqueId);

        setPeerInstance(peer);

        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream;
            }

            peer.on("call", (call) => {
              call.answer(stream);
              call.on("stream", (userVideoStream) => {
                if (callingVideoRef.current) {
                  callingVideoRef.current.srcObject = userVideoStream;
                }
              });
            });
          });
      }
      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [myUniqueId]);

  const joinCall = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const call = peerInstance?.call(idToCall, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-12">
      <p className="mb-2">your id : {myUniqueId}</p>
      <div className="mb-2 flex flex-row gap-4">
        <Input
          placeholder="Id to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
        />
        <Button onClick={joinCall}>call</Button>
      </div>
      <video muted className="w-100" playsInline ref={myVideoRef} autoPlay />

      <video className="w-72" playsInline ref={callingVideoRef} autoPlay />
    </div>
  );
}
