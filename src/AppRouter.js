import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Trending from './Trending'; // Import the Trending component

import Connect from './Connect'; // Import the Connect component

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/trending" element={<Trending />} />
      
      <Route path="/connect" element={<Connect />} /> {/* Route to Connect Page */}
    </Routes>
  </Router>
);

export default AppRouter;
