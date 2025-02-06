import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth';
import Profile from './components/profile';
import EditProfile from './components/editProfile'; // Import the EditProfile component
import PageLayout from './pagelayout/pageLayout';
import Feed from './pages/feed';
import Chat from './pages/chat';
import Home from './pages/Home';
import OtherProfile from './components/otherProfile';
// import { colors } from '@mui/material';

function App() {
  return (
    
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<OtherProfile />} />

        </Routes>
      </PageLayout>
    </Router>
  
  );
}

export default App;
