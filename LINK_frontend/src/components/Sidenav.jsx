import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, Avatar } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, Explore as ExploreIcon, AddBox as CreateIcon, Logout as LogoutIcon, Person } from '@mui/icons-material';
import SearchPanel from './SearchPanel';
import CreatePost from './createPost';
import { styled } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/link-logo-big.png';
import LogoIcon from '../assets/logo_icon_light.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultProfileImage from '../assets/default_profile.jpg'; // Placeholder for profile pic

// Drawer width
const drawerWidth = 240;

// Styled ListItem component
const StyledListItem = styled(ListItem)(({ theme, isCollapsed }) => ({
  padding: '15px 30px', // Increased padding for bigger items
  justifyContent: isCollapsed ? 'center' : 'flex-start', // Center icons in collapsed state
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Instagram Logo styling
const InstagramLogo = styled(Box)(({ isCollapsed }) => ({
  backgroundImage: `url(${isCollapsed ? LogoIcon : Logo})`, // Switch logos based on collapse state
  backgroundPosition: 'center',
  marginRight: '70px',
  backgroundSize: 'contain',
  width: isCollapsed ? '100px' : '500px', // Adjust the width based on the logo
  height: isCollapsed ? '50px' : '120px', // Adjust the height based on the logo
  marginTop: '25px',
  backgroundRepeat: 'no-repeat',
  display: 'inline-block',
  zIndex: 2,
}));

// Styled Logout Icon
const StyledLogoutIcon = styled(LogoutIcon)(({ theme }) => ({
  color: '#6a0dad', // Ruby color
  fontSize: '32px',
}));

const SideNav = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/home');
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  // Handle state reset when navigating to a new route
  useEffect(() => {
    const path = location.pathname;

    if (path !== activeTab) {
      setSearchOpen(false);
      setActiveTab(path);
      setCollapsed(false); // Reset the collapsed state when navigating
    }
  }, [location, activeTab]);

  // Fetch the profile picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = localStorage.getItem('username');
        const accessToken = localStorage.getItem('accessToken');

        if (!username || !accessToken) {
          console.error("No username or access token found");
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/v1/users/${username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data.data;
          setProfilePic(userData.profilePicture || defaultProfileImage);
        } else {
          console.error("Failed to fetch user data", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setProfilePic(defaultProfileImage);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSearchClick = () => {
    setSearchOpen(!isSearchOpen);
    setCollapsed(!isCollapsed); // Toggle collapse state based on search panel
  };

  const handleCreateClick = () => {
    setCreatePostOpen(true);
  };

  const handleCreatePostClose = () => {
    setCreatePostOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const username = localStorage.getItem('username');

      await axios.post('http://localhost:8000/api/v1/users/logout',
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');

      toast.success('Successfully logged out!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Logout failed!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const fullNav = (
    <Box
      sx={{
        width: isCollapsed ? 60 : drawerWidth,
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        top: 0,
        left: 0,
        padding: 2,
        backgroundColor: '#fff',
        zIndex: 1300,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderRight: '0.35px solid grey',
      }}
    >
      <Box>
        <Box
          sx={{
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <Link to={activeTab}>
            <InstagramLogo isCollapsed={isCollapsed} />
          </Link>
        </Box>
        <List sx={{ marginTop: '0' }}>
          <StyledListItem button component={Link} to="/home" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <HomeIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Home" />}
          </StyledListItem>
          <StyledListItem button component={Link} to="/feed" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <ExploreIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Feed" />}
          </StyledListItem>
          <StyledListItem button onClick={handleSearchClick} isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <SearchIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Search" />}
          </StyledListItem>
          <StyledListItem button onClick={handleCreateClick} isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <CreateIcon fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Create" />}
          </StyledListItem>
          <StyledListItem button component={Link} to="/chat" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <Person fontSize="large" />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Chat" />}
          </StyledListItem>
          <StyledListItem button component={Link} to="/profile" isCollapsed={isCollapsed}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <Avatar src={profilePic} sx={{ width: 32, height: 32 }} /> {/* Display the profile picture */}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Profile" />}
          </StyledListItem>
        </List>
      </Box>
      <StyledListItem button onClick={handleLogout} sx={{ position: 'relative', bottom: '20px', justifyContent: 'center' }} isCollapsed={isCollapsed}>
        <ListItemIcon sx={{ minWidth: '35px', justifyContent: 'center' }}>
          <StyledLogoutIcon />
        </ListItemIcon>
      </StyledListItem>
    </Box>
  );

  const bottomNav = (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 1300,
      }}
    >
      <ListItem button component={Link} to="/">
        <ListItemIcon><HomeIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleSearchClick}>
        <ListItemIcon><SearchIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleCreateClick}>
        <ListItemIcon><CreateIcon /></ListItemIcon>
      </ListItem>
      <ListItem button component={Link} to="/feed">
        <ListItemIcon><ExploreIcon /></ListItemIcon>
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon><StyledLogoutIcon /></ListItemIcon>
      </ListItem>
    </Box>
  );

  return (
    <>
      {isSmallScreen ? bottomNav : fullNav}
      <SearchPanel open={isSearchOpen} onClose={() => { setSearchOpen(false); setCollapsed(false); }} /> {/* Added reset collapse */}
      <CreatePost open={isCreatePostOpen} onClose={handleCreatePostClose} /> {/* Render CreatePost dialog */}
      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
    </>
  );
};

export default SideNav;
