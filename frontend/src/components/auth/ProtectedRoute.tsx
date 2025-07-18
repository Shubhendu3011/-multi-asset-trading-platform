import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import { useAppSelector } from '@/store';
import AuthService from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = AuthService.getToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Try to get user profile to validate token
        await AuthService.getProfile();
        setIsValidToken(true);
      } catch (error) {
        // Token is invalid, remove it
        AuthService.removeToken();
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#00d4aa', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Check if user is authenticated (either from Redux or valid token)
  if (!isAuthenticated && !isValidToken) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
