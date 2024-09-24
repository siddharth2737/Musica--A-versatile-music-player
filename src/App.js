import React, { useState, useRef, useEffect } from "react";
import './App.css';
import Footer from './Footer';

function App() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [songLyrics, setSongLyrics] = useState(null);
  const audioRefs = useRef({});
  const genres = ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop'];

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
    let data = await fetch(`https://v1.nocodeapi.com/siddharth_gautam3/spotify/rDiqdBbmlvzbNfey/search?q=${keyword === "" ? "trending" : keyword}&type=track`);
    let convertedData = await data.json();
    const filteredTracks = convertedData.tracks.items.filter(track => track.preview_url);
    setTracks(filteredTracks);
    setIsLoading(false);
  };

  const getSongLyrics = async (trackId) => {
    try {
      const response = await fetch(
        `https://api.genius.com/songs/${trackId}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'genius-song-lyrics1.p.rapidapi.com',
            'x-rapidapi-key': 'e759c2819bmsh8b3c8da4a34f776p1d9384jsna73157ccf4b2'
          }
        }
      );
      const data = await response.json();
      const lyricsPath = data.response.song.path;
      const lyricsResponse = await fetch(`https://genius.com${lyricsPath}`);
      const lyricsHtml = await lyricsResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(lyricsHtml, 'text/html');
      const lyrics = doc.querySelector('.lyrics').innerText;
      setSongLyrics(lyrics);
    } catch (error) {
      console.error("Error fetching song lyrics:", error);
    }
  };

  const handlePlayPause = async (trackId, previewUrl) => {
    let audio = audioRefs.current[trackId];

    if (!audio) {
      audioRefs.current[trackId] = new Audio(previewUrl);
      audio = audioRefs.current[trackId];
    }

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
      setCurrentTrackIndex(tracks.findIndex(track => track.id === trackId));
      setRecentlyPlayed(prev => [tracks.find(track => track.id === trackId), ...prev.slice(0, 4)]);
      await getSongLyrics(trackId);
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

      <div className="container mt-4">
        














        <div className="container2 row">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <div key={track.album.id} className="col-lg-2 col-md-4 py-2">
                <div className="card h-100">
                  <img
                    src={track.album.images[1].url}
                    className="card-img-top rounded-circle album-image"
                    alt={track.name}
                    onClick={() => handlePlayPause(track.id, track.preview_url)}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{track.name}</h5>
                    <p className="card-text">{track.album.artists[0].name}</p>
                    <button onClick={() => addToPlaylist(track)} className="btn btn-secondary">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No tracks found</p>
            </div>
          )}












          <div className="list2 row">
            <div className="col-lg-8">
              {/* Existing tracks and genres code */}
            </div>

            {/* Song queue */}
            <div className="col-lg-4">
              <h4 className="playlist2">Your Playlist</h4>
              <ul className="list-group">
                {playlist.length > 0 ? (
                  playlist.map((track, index) => (
                    <li
                      key={track.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span onClick={() => handlePlayPause(track.id, track.preview_url)}>
                        {track.name} - {track.album.artists[0].name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No songs in queue</li>
                )}
              </ul>
            </div>
          </div>














        </div>
      </div>

      <Footer
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={handlePlayPauseFooter}
        onBackward={handleBackward}
        onForward={handleForward}
        onSeek={handleSeek}
        lyrics={songLyrics} />
    </>
  );
}

export default App;
