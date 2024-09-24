import React, { useState, useEffect, useRef } from 'react';

const Play = () => {
  const [ws, setWs] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'play') {
        setPlaying(true);
        audioRef.current.play();
      } else if (message.type === 'pause') {
        setPlaying(false);
        audioRef.current.pause();
      } else if (message.type === 'seek') {
        audioRef.current.currentTime = message.currentTime;
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const playPause = () => {
    if (ws) {
      const action = playing ? 'pause' : 'play';
      ws.send(JSON.stringify({ type: action }));
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (ws && audioRef.current) {
      ws.send(JSON.stringify({ type: 'seek', currentTime: audioRef.current.currentTime }));
    }
  };

  return (
    <>

    
        <div>
      <h1>Now Playing</h1>
      <audio
        ref={audioRef}
        src="URL_TO_TRACK"
        onTimeUpdate={handleTimeUpdate}
      />
      <button onClick={playPause}>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
    </>

  );
};

export default Play;
