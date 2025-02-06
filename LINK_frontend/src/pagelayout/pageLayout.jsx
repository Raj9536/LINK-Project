import React from 'react';
import { useLocation } from 'react-router-dom';
import SideNav from '../components/Sidenav'; // Import your SideNav component
import Box from '@mui/material/Box';

const sideNavWidth = 240; // Adjust this to the width of your SideNav

const PageLayout = ({ children }) => {
  const location = useLocation();

  // Specify the paths where the SideNav should NOT be shown (e.g., authentication pages)
  const noNavPaths = ['/'];

  // Check if the current path is in the noNavPaths array
  const showSideNav = !noNavPaths.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex' }}>
      {showSideNav && (
        <Box sx={{ width: sideNavWidth }}>
          <SideNav />
        </Box>
      )}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          /* ml: showSideNav ? `${sideNavWidth}px` : 0, */ // Adjust margin-left when SideNav is shown
        }}
      >
        {children} {/* This renders the page content */}
      </Box>
    </Box>
  );
};

export default PageLayout;
