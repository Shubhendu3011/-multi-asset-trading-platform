import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isEmailVerified: boolean;
  isKycVerified: boolean;
  createdAt: Date;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_EXPIRES_IN = '7d';

  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<{ user: UserResponse; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email.toLowerCase() },
            { username: data.username.toLowerCase() }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          username: data.username.toLowerCase(),
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'USER',
          isEmailVerified: false,
          isKycVerified: false,
        }
      });

      // Generate JWT token
      const token = this.generateToken(user.id);

      // Return user data (without password)
      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: user.isKycVerified,
        createdAt: user.createdAt,
      };

      logger.info(`New user registered: ${user.email}`);
      return { user: userResponse, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginData): Promise<{ user: UserResponse; token: string }> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      // Return user data (without password)
      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: user.isKycVerified,
        createdAt: user.createdAt,
      };

      logger.info(`User logged in: ${user.email}`);
      return { user: userResponse, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: user.isKycVerified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: Partial<UserResponse>): Promise<UserResponse> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
        }
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        isKycVerified: updatedUser.isKycVerified,
        createdAt: updatedUser.createdAt,
      };
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env['JWT_SECRET']!,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env['JWT_SECRET']!);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 