import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Grid, Card, CardMedia, Modal, Backdrop, Fade
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';
import defaultProfileImage from '../assets/default_profile.jpg';

const getButtonStyle = () => ({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#6a0dad', // Updated to the new purple color
  borderColor: '#6a0dad', // Updated to the new purple color
  '&:hover': {
    backgroundColor: '#6a0dad', // Updated to the new purple color
    color: 'white',
    borderColor: '#6a0dad', // Updated to the new purple color
  },
  width: '12rem',
});

export default function Profile() {
  const [user, setUser] = useState({
    username: 'Sample User',
    bio: '',
    profilePicture: '',
    followers: 0,
    following: 0,
    posts: [],
  });

  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postCount, setPostCount] = useState(0);

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

        // Fetch posts only if user has posts
        let posts = [];
        if (userData.posts.length > 0) {
          const postResponse = await axios.get(`http://localhost:8000/api/v1/posts/user/${username}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (postResponse.status === 200) {
            posts = postResponse.data;
          }
        }

        setUser({
          username: userData.username || 'Sample User',
          bio: userData.description || 'This user has no bio.',
          profilePicture: userData.profilePicture || '',
          followers: userData.followers ? userData.followers.length : 0,
          following: userData.followings ? userData.followings.length : 0,
          posts: posts || [],
        });
        setPostCount(posts.length);  // Set the post count
        setLoading(false);
      } else {
        console.error("Failed to fetch user data", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // Set up an interval to refresh followers, following counts, and posts every 30 seconds
    const intervalId = setInterval(fetchUserProfile, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  // Handle opening post modal
  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <Box sx={{ minHeight: '85vh', backgroundColor: '#fff', p: 4, ml: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', pb: 4, borderBottom: '1px solid #ccc' }}>
        <Box 
          sx={{ 
            width: 134,
            height: 134,
            borderRadius: '50%', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={handleOpenProfileModal}
        >
          <img src={user.profilePicture}
            alt={user.username}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center' 
            }} 
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1">{user.username}</Typography>
          <Typography variant="subtitle1" color="textSecondary">@{user.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.bio}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            <Typography>{user.followers} Followers</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon />
            <Typography>{user.following} Following</Typography>
          </Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/edit-profile"
            sx={getButtonStyle()}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">Posts</Typography>
          <Typography variant="body2" color="textSecondary">
            {postCount} {postCount === 1 ? 'Post' : 'Posts'}
          </Typography>
        </Box>
        <Grid container spacing={4} sx={{ pt: 2 }}>
          {loading ? (
            <Typography 
              sx={{ 
                textAlign: 'center', 
                width: '100%', 
                color: 'grey', 
                fontWeight: 'bold', 
                mt: 4 
              }}
            >
              Loading posts...
            </Typography>
          ) : (
            user.posts.length > 0 ? (
              user.posts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sorting posts by date in descending order
                .map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        paddingBottom: '75%',
                        boxShadow: 3,
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleOpenPostModal(post)} // Open post modal on click
                    >
                      <CardMedia
                        component="img"
                        image={post.imgurl}
                        alt={`Post ${index + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <FavoriteIcon fontSize="small" />
                          <Typography>{post.likes?.length || 0} Likes</Typography>
                          <CommentIcon fontSize="small" />
                          <Typography>{post.comments?.length || 0} Comments</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))
            ) : (
              <Typography 
                sx={{ 
                  textAlign: 'center', 
                  width: '100%', 
                  color: 'grey', 
                  fontWeight: 'bold', 
                  mt: 4 
                }}
              >
                No posts yet.
              </Typography>
            )
          )}
        </Grid>
      </Box>

      {/* Profile Modal */}
      <Modal
        open={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isProfileModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" component="h2">{user.username}</Typography>
            <img
              src={user.profilePicture || defaultProfileImage}
              alt="Profile"
              style={{ 
                width: '200px', 
                height: '200px', 
                borderRadius: '50%', 
                margin: '20px 0' 
              }}
            />
            <Typography variant="body1">{user.bio || 'No bio available.'}</Typography>
            <Button
              variant="contained"
              onClick={handleCloseProfileModal}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Post Modal */}
      <Modal
        open={isPostModalOpen}
        onClose={handleClosePostModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isPostModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedPost && (
              <>
                <Typography variant="h6" component="h2">
                  Post Details
                </Typography>
                <img
                  src={selectedPost.imgurl}
                  alt="Post"
                  style={{ 
                    width: '100%', 
                    height: '50vh',
                    margin: '20px 0', 
                    borderRadius: '8px' 
                  }}
                />
                <Typography variant="body2">{selectedPost.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="body2">Likes: {selectedPost.likes?.length || 0}</Typography>
                  <Typography variant="body2">Comments: {selectedPost.comments?.length || 0}</Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleClosePostModal}
                  sx={{ mt: 2 }}
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
