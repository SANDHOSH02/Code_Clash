import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Editor from './pages/Editor';
import Home from './pages/Home'; // Placeholder for home page
import Challenges from './pages/Challenges'; // Placeholder for challenges page

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;