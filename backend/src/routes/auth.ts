import { Router, Request, Response } from 'express';
import { AuthService, RegisterData, LoginData } from '../services/authService';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password, firstName, lastName }: RegisterData = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Email, username, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    const result = await AuthService.register({
      email,
      username,
      password,
      ...(firstName && { firstName }),
      ...(lastName && { lastName })
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    logger.error('Registration route error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginData = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const result = await AuthService.login({ email, password });

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    logger.error('Login route error:', error);
    
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUserById(req.user!.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get profile route error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;

    const updatedUser = await AuthService.updateProfile(req.user!.id, {
      firstName,
      lastName
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Update profile route error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long'
      });
    }

    await AuthService.changePassword(req.user!.id, currentPassword, newPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    logger.error('Change password route error:', error);
    
    if (error.message.includes('Current password is incorrect')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to change password' });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // You could implement a blacklist here if needed
    logger.info(`User logged out: ${req.user!.email}`);
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout route error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUserById(req.user!.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new token
    const token = AuthService['generateToken'](user.id);

    res.json({
      message: 'Token refreshed successfully',
      user,
      token
    });
  } catch (error) {
    logger.error('Refresh token route error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router; 