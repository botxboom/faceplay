"use client";

import useMedia from "../_hooks/useMedia";

export default function Lobby() {
  const { stream } = useMedia();

  return (
    stream && (
      <video
        autoPlay
        ref={(node) => {
          if (node) node.srcObject = stream;
        }}
        width={500}
        height={500}
      ></video>
    )
  );
}
