import React, { useState, useRef, useEffect } from "react";
import './Trending.css'; // Create and customize this CSS file similar to App.css
import Footer from './Footer';

function Trending() {
  const [keyword, setKeyword] = useState("hit");
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef({});
  const [progress, setProgress] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(savedPlaylist);
  }, []);

  const savePlaylistToLocalStorage = () => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  };

  const addToPlaylist = (track) => {
    const updatedPlaylist = [...playlist, track];
    setPlaylist(updatedPlaylist);
    savePlaylistToLocalStorage();
  };

  const getTracks = async () => {
    setIsLoading(true);
    let data = await fetch(`https://v1.nocodeapi.com/siddharth_gautam3/spotify/rDiqdBbmlvzbNfey/search?q=${keyword}&type=track`);
    let convertedData = await data.json();
    const filteredTracks = convertedData.tracks.items.filter(track => track.preview_url);
    setTracks(filteredTracks);
    setIsLoading(false);
  };

  useEffect(() => {
    getTracks(); // Fetch tracks automatically on page load
  }, []);

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
      setRecentlyPlayed(prev => [tracks.find(track => track.album.id === trackId), ...prev.slice(0, 4)]);
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

  return (
    <>
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Musica</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarSupportedContent">
            <input
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') getTracks(); }}
              className="form-control me-2 w-75"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button onClick={getTracks} className="btn btn-outline-success">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <a className="nav-link" href="/"><h1 className="nav-text">Home</h1></a>
            <a className="nav-link" href="/Trending"><h1 className="nav-text">Trending</h1></a>            
            <a className="nav-link" href="/connect"><h1 className="nav-text">Connect</h1></a>
          </div>
        </div>
      </nav>

      <div className="container">
        {isLoading && (
          <div className="row">
            <div className="col-12 py-5 text-center">
              <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}

        {!isLoading && keyword === "trending" && (
          <div className="row">
            <div className="col-12 py-5">
              <h1 id="trending">Trending</h1>
            </div>
          </div>
        )}

        {/* Recently Played */}
       

        {/* Music Tracks */}
        <div className="row">
          {tracks.map((element) => (
            <div key={element.album.id} className="col-lg-3 col-md-6 py-5">
              <div className="card h-100">
                <img
                  src={element.album.images[1].url}
                  className="card-img-top rounded-circle album-image"
                  alt={element.name}
                  onClick={() => handlePlayPause(element.album.id)}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{element.name}</h5>
                  <p className="card-text align-self-center">
                    {element.album.artists[0].name}
                  </p>
                  <button onClick={() => addToPlaylist(element)} className="btn btn-primary mt-auto">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <audio
                  ref={(el) => audioRefs.current[element.album.id] = el}
                  src={element.preview_url}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer
        onPlayPause={handlePlayPauseFooter}
        onBackward={handleBackward}
        onForward={handleForward}
        isPlaying={isPlaying}
        progress={progress}
        onSeek={handleSeek}
      />
    </>
  );
}

export default Trending;
