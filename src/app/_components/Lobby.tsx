"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

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
              console.log(call);
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

  const handleCall = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const call = peerInstance?.call(idToCall, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            console.log(userVideoStream);
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <p>your id : {myUniqueId}</p>
      <video className="w-72" playsInline ref={myVideoRef} autoPlay />
      <input
        className="border text-black"
        placeholder="Id to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <button onClick={handleCall}>call</button>
      <video className="w-72" playsInline ref={callingVideoRef} autoPlay />
    </div>
  );
}
