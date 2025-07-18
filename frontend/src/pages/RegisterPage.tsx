import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Badge } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import AuthService from '@/services/authService';
import { useAppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.register({
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      // Store token
      AuthService.setToken(response.token);
      
      // Update Redux store
      dispatch(loginSuccess({
        user: response.user,
        token: response.token,
      }));

      toast.success('Registration successful! Welcome to the platform!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          background: 'rgba(26, 31, 46, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(47, 53, 66, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #00d4aa, #3742fa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join the multi-asset trading platform
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(47, 53, 66, 0.5)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00d4aa',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00d4aa',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00d4aa',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(47, 53, 66, 0.5)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00d4aa',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00d4aa',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00d4aa',
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(47, 53, 66, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00d4aa',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4aa',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00d4aa',
                },
              }}
            />

            <TextField
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(47, 53, 66, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00d4aa',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4aa',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00d4aa',
                },
              }}
            />

            <TextField
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                },
              })}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(47, 53, 66, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00d4aa',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4aa',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00d4aa',
                },
              }}
            />

            <TextField
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(47, 53, 66, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00d4aa',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00d4aa',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00d4aa',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(45deg, #00d4aa, #00a37a)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00a37a, #008f6b)',
                },
                '&:disabled': {
                  background: 'rgba(0, 212, 170, 0.3)',
                },
                height: 48,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Create Account'
              )}
            </Button>
          </Box>

          {/* Links */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#00d4aa',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
