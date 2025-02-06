import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Slide, Link } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import Logo from '../assets/link-logo.png'; 

const getButtonStyle = () => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#6a0dad', // Changed to purple
  '&:hover': {
    backgroundColor: '#59168b', // A darker purple for hover effect
  },
  width: '12rem',
});

function Auth() {
  const [view, setView] = useState('default'); // default, signin, signup
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false }); // To track interaction for signup fields
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'email') {
      validateEmail(formData.email);
    } else if (name === 'password') {
      validatePassword(formData.password);
    }
  };

  const validateEmail = (email) => {
    const emailValid = email.includes('@');
    setErrors((prev) => ({
      ...prev,
      email: emailValid ? '' : 'Email must include "@"',
    }));
    return emailValid;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const passwordValid = passwordRegex.test(password);
    setErrors((prev) => ({
      ...prev,
      password: passwordValid
        ? ''
        : 'Password must be at least 8 characters long, with one uppercase, one lowercase, and a number.',
    }));
    return passwordValid;
  };

  const handleSignUp = async () => {
    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/signup', formData);
      if (response.status === 201) {
        toast.success('Signup successful! Now you can login');
        setTimeout(() => {
          setView('default'); // Reset to default view
        }, 2000);
      } else {
        toast.warn('Signup succeeded, but there was an issue.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred during signup.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', formData);
      if (response.status === 200) {
        const { accessToken, username } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('username', username);
        toast.success(`Welcome, ${username}! Redirecting to home page...`);
        setTimeout(() => {
          navigate('/home'); 
        }, 2000);
      } else {
        toast.warn('Login succeeded, but there was an issue.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred during login.');
    }
  };

  const handleSignInClick = () => {
    setView('signin');
  };

  const handleSignUpClick = () => {
    setView('signup');
  };

  const handleLogoClick = () => {
    setView('default');
  };

  return (
    <Box display="flex" height="100vh" maxHeight={655}>
      <Box 
        flex={1} 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        sx={{ 
          transition: 'transform 0.5s ease',
          transform: view === 'signup' ? 'translateX(100%)' : 'none', 
          cursor: view !== 'default' ? 'pointer' : 'default',
          zIndex: 2
        }}
        onClick={view !== 'default' ? handleLogoClick : null}
      >
        <img 
          src={Logo} 
          alt="Logo" 
          style={{ 
            width: '25rem', 
            height: 'auto',
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>

      {/* Signup Form Section */}
      {view === 'signup' && (
        <Box 
          position="absolute"
          top={0}
          left={0}
          height="100%"
          width="50%"
          sx={{ 
            transition: 'all 0.5s ease', 
          }}
        >
          <Slide direction="right" in={view === 'signup'} mountOnEnter unmountOnExit>
            <Box 
              display="flex" 
              flexDirection="column" 
              justifyContent="center" 
              alignItems="center"
              height="100%"
              padding="0 2rem"
              boxSizing="border-box"
            >
              <TextField 
                label="Email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur} // Trigger validation on blur
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1rem' }} 
                error={!!errors.email && touched.email} // Show error if field has been touched
                helperText={touched.email && errors.email}
              />
              <TextField 
                label="Username" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1rem' }} 
              />
              <TextField 
                label="Password" 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur} // Trigger validation on blur
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1.5rem' }} 
                error={!!errors.password && touched.password} // Show error if field has been touched
                helperText={touched.password && errors.password}
              />
              <Button 
                variant="contained" 
                sx={{
                  width: '100%',
                  backgroundColor: '#6a0dad', // Changed to purple
                  '&:hover': { backgroundColor: '#59168b' }, // Darker purple for hover effect
                  marginBottom: '1rem',
                }}
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
              <Link 
                href="#" 
                onClick={() => setView('signin')}
                sx={{ color: '#6a0dad', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }} // Changed to purple
              >
                Already have an account? Login
              </Link>
            </Box>
          </Slide>
        </Box>
      )}

      {/* Button/Form Section */}
      <Box 
        flex={1} 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        sx={{
          position: 'relative',
          overflow: 'hidden', 
        }}
      >
        {view === 'default' && (
          <Box 
            display="flex" 
            justifyContent="space-evenly" 
            width="80%" 
            sx={{ transition: 'all 0.5s ease' }}
          >
            <Button 
              className="shadow-2xl" 
              sx={getButtonStyle()} 
              onClick={handleSignInClick}
            >
              SIGN IN
            </Button>
            <Button 
              className="shadow-2xl" 
              sx={getButtonStyle()} 
              onClick={handleSignUpClick}
            >
              SIGN UP
            </Button>
          </Box>
        )}

        {view === 'signin' && (
          <Slide direction="left" in={view === 'signin'} mountOnEnter unmountOnExit>
            <Box 
              display="flex" 
              flexDirection="column" 
              justifyContent="center" 
              alignItems="center"
              sx={{
                position: 'absolute',
                top: 0,
                left: '0',
                width: '100%',
                height: '100%',
                padding: '0 2rem',
                boxSizing: 'border-box',
              }}
            >
              <TextField 
                label="Username" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1rem' }} 
              />
              <TextField 
                label="Password" 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                variant="outlined" 
                fullWidth 
                sx={{ marginBottom: '1.5rem' }} 
              />
              <Button 
                variant="contained" 
                sx={{
                  width: '100%',
                  backgroundColor: '#6a0dad', // Changed to purple
                  '&:hover': { backgroundColor: '#59168b' }, // Darker purple for hover effect
                  marginBottom: '1rem',
                }}
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Link 
                href="#" 
                onClick={() => setView('signup')}
                sx={{ color: '#6a0dad', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }} // Changed to purple
              >
                Don't have an account? Signup
              </Link>
            </Box>
          </Slide>
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Auth;
