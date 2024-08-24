"use client";

import { useEffect, useRef } from "react";

const Audio = ({ url, playing }: { url: string; playing: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (playing === true) playAudio();
    else pauseAudio();
  }, [playing]);

  return (
    <audio ref={audioRef} loop>
      <source src={url} type="audio/ogg" />
      Your browser does not support the audio tag.
    </audio>
  );
};

export default Audio;
