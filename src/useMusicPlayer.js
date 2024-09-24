import { useState, useRef, useEffect } from "react";

export const useMusicPlayer = (tracks) => {
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRefs = useRef({});

  const handlePlayPause = (trackId) => {
    const audio = audioRefs.current[trackId];

    if (!audio) return;

    if (playingTrackId === trackId) {
      audio.pause();
      setPlayingTrackId(null);
      setIsPlaying(false);
    } else {
      if (playingTrackId && audioRefs.current[playingTrackId]) {
        audioRefs.current[playingTrackId].pause();
      }
      audio.play();
      setPlayingTrackId(trackId);
      setIsPlaying(true);
      setCurrentTrackIndex(tracks.findIndex(track => track.album.id === trackId));
    }
  };

  const handleBackward = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      handlePlayPause(tracks[currentTrackIndex - 1].album.id);
    }
  };

  const handleForward = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      handlePlayPause(tracks[currentTrackIndex + 1].album.id);
    }
  };

  const handlePlayPauseFooter = (playing) => {
    if (currentTrackIndex !== null) {
      const trackId = tracks[currentTrackIndex].album.id;
      if (playing) {
        audioRefs.current[trackId].play();
      } else {
        audioRefs.current[trackId].pause();
      }
      setIsPlaying(playing);
    }
  };

  const handleSeek = (newProgress) => {
    if (currentTrackIndex !== null) {
      const trackId = tracks[currentTrackIndex].album.id;
      const audio = audioRefs.current[trackId];
      if (audio) {
        const newTime = (newProgress / 100) * audio.duration;
        audio.currentTime = newTime;
      }
    }
  };

  useEffect(() => {
    const audio = audioRefs.current[tracks[currentTrackIndex]?.album.id];
    if (audio) {
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.addEventListener('timeupdate', updateProgress);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [currentTrackIndex]);

  return {
    handlePlayPause,
    handleBackward,
    handleForward,
    handlePlayPauseFooter,
    handleSeek,
    isPlaying,
    progress,
    audioRefs,
  };
};
