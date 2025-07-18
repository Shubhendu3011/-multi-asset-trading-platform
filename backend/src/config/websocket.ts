import { Server } from 'socket.io';
import { logger } from '../utils/logger';

export const setupWebSocket = (io: Server): void => {
  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    // Handle price updates subscription
    socket.on('subscribe:price', (assetId: string) => {
      socket.join(`price:${assetId}`);
      logger.info(`📊 Client ${socket.id} subscribed to price updates for asset ${assetId}`);
    });

    // Handle price updates unsubscription
    socket.on('unsubscribe:price', (assetId: string) => {
      socket.leave(`price:${assetId}`);
      logger.info(`📊 Client ${socket.id} unsubscribed from price updates for asset ${assetId}`);
    });

    // Handle trading updates subscription
    socket.on('subscribe:trading', (userId: string) => {
      socket.join(`trading:${userId}`);
      logger.info(`💹 Client ${socket.id} subscribed to trading updates for user ${userId}`);
    });

    // Handle trading updates unsubscription
    socket.on('unsubscribe:trading', (userId: string) => {
      socket.leave(`trading:${userId}`);
      logger.info(`💹 Client ${socket.id} unsubscribed from trading updates for user ${userId}`);
    });

    // Handle portfolio updates subscription
    socket.on('subscribe:portfolio', (userId: string) => {
      socket.join(`portfolio:${userId}`);
      logger.info(`📈 Client ${socket.id} subscribed to portfolio updates for user ${userId}`);
    });

    // Handle portfolio updates unsubscription
    socket.on('unsubscribe:portfolio', (userId: string) => {
      socket.leave(`portfolio:${userId}`);
      logger.info(`📈 Client ${socket.id} unsubscribed from portfolio updates for user ${userId}`);
    });

    // Handle market data subscription
    socket.on('subscribe:market', () => {
      socket.join('market:updates');
      logger.info(`📊 Client ${socket.id} subscribed to market updates`);
    });

    // Handle market data unsubscription
    socket.on('unsubscribe:market', () => {
      socket.leave('market:updates');
      logger.info(`📊 Client ${socket.id} unsubscribed from market updates`);
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Client disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`🔌 Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('✅ WebSocket server configured successfully');
};

// Utility functions for emitting events
export const emitPriceUpdate = (io: Server, assetId: string, priceData: any): void => {
  io.to(`price:${assetId}`).emit('price:update', {
    assetId,
    ...priceData,
    timestamp: new Date().toISOString()
  });
};

export const emitTradingUpdate = (io: Server, userId: string, tradingData: any): void => {
  io.to(`trading:${userId}`).emit('trading:update', {
    userId,
    ...tradingData,
    timestamp: new Date().toISOString()
  });
};

export const emitPortfolioUpdate = (io: Server, userId: string, portfolioData: any): void => {
  io.to(`portfolio:${userId}`).emit('portfolio:update', {
    userId,
    ...portfolioData,
    timestamp: new Date().toISOString()
  });
};

export const emitMarketUpdate = (io: Server, marketData: any): void => {
  io.to('market:updates').emit('market:update', {
    ...marketData,
    timestamp: new Date().toISOString()
  });
}; 