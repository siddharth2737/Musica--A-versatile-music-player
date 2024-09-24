import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connect.css';
import Footer from './Footer';

const Connect = () => {
  const [isLoading, setIsLoading] = useState(false);  
  const [tracks, setTracks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [userId, setUserId] = useState('');
  const [peerId, setPeerId] = useState('');
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();
  const getTracks = async () => {
    setIsLoading(true);
    let data = await fetch(`https://v1.nocodeapi.com/siddharth_gautam3/spotify/rDiqdBbmlvzbNfey/search?q=${keyword === "" ? "trending" : keyword}&type=track`);
    let convertedData = await data.json();
    const filteredTracks = convertedData.tracks.items.filter(track => track.preview_url);
    setTracks(filteredTracks);
    setIsLoading(false);
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Handle incoming messages (sync playback)
    };

    return () => {
      socket.close();
    };
  }, []);

  const connect = () => {
    
    if (ws) {
      ws.send(JSON.stringify({ type: 'connect', userId, peerId }));
      navigate('/play'); // Redirect to the playback page
    }
  };

  return (
    <>
     <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Musica</a>
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

      <div className="container py-5">
        <h1 className="text-center mb-4">Connect with a Friend</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Your ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Friend's ID"
                value={peerId}
                onChange={(e) => setPeerId(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={connect}>
              Connect
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Connect;
