import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Refresh,
  MoreVert,
} from '@mui/icons-material';

import { useAppSelector } from '@/store';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Mock data - will be replaced with real data in Phase 3
  const portfolioData = {
    totalValue: 125000,
    change24h: 2500,
    changePercent: 2.04,
    isPositive: true,
  };

  const recentTrades = [
    {
      id: 1,
      asset: 'BTC',
      type: 'BUY',
      amount: 0.5,
      price: 45000,
      total: 22500,
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      asset: 'AAPL',
      type: 'SELL',
      amount: 10,
      price: 150,
      total: 1500,
      timestamp: '2024-01-15T09:15:00Z',
    },
    {
      id: 3,
      asset: 'ETH',
      type: 'BUY',
      amount: 2.5,
      price: 2800,
      total: 7000,
      timestamp: '2024-01-14T16:45:00Z',
    },
  ];

  const topAssets = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45000,
      change24h: 2.5,
      marketCap: '850B',
      volume: '25B',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2800,
      change24h: -1.2,
      marketCap: '350B',
      volume: '15B',
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150,
      change24h: 0.8,
      marketCap: '2.5T',
      volume: '5B',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.firstName || user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your trading overview for today
        </Typography>
      </Box>

      {/* Portfolio Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #00d4aa 0%, #00a37a 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Portfolio Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {formatCurrency(portfolioData.totalValue)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {portfolioData.isPositive ? (
                      <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
                    ) : (
                      <TrendingDown sx={{ mr: 1, fontSize: 20 }} />
                    )}
                    <Typography variant="body2">
                      {portfolioData.isPositive ? '+' : ''}
                      {formatCurrency(portfolioData.change24h)} ({portfolioData.changePercent}%)
                    </Typography>
                  </Box>
                </Box>
                <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(26, 31, 46, 0.9)', border: '1px solid rgba(47, 53, 66, 0.5)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Active Orders
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2 pending, 1 partially filled
                  </Typography>
                </Box>
                <ShowChart sx={{ fontSize: 40, color: '#00d4aa' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(26, 31, 46, 0.9)', border: '1px solid rgba(47, 53, 66, 0.5)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Watchlist
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assets you're tracking
                  </Typography>
                </Box>
                <ShowChart sx={{ fontSize: 40, color: '#3742fa' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Trades and Top Assets */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(26, 31, 46, 0.9)', border: '1px solid rgba(47, 53, 66, 0.5)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Recent Trades</Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              <Box sx={{ space: 2 }}>
                {recentTrades.map((trade) => (
                  <Box
                    key={trade.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid rgba(47, 53, 66, 0.3)',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          bgcolor: trade.type === 'BUY' ? '#00d4aa' : '#ff4757',
                        }}
                      >
                        {trade.asset}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {trade.asset}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(trade.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={trade.type}
                        size="small"
                        sx={{
                          bgcolor: trade.type === 'BUY' ? 'rgba(0, 212, 170, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                          color: trade.type === 'BUY' ? '#00d4aa' : '#ff4757',
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(trade.total)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(26, 31, 46, 0.9)', border: '1px solid rgba(47, 53, 66, 0.5)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Top Assets</Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ space: 2 }}>
                {topAssets.map((asset, index) => (
                  <Box
                    key={asset.symbol}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid rgba(47, 53, 66, 0.3)',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          bgcolor: asset.change24h >= 0 ? '#00d4aa' : '#ff4757',
                        }}
                      >
                        {asset.symbol}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {asset.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {asset.symbol}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(asset.price)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: asset.change24h >= 0 ? '#00d4aa' : '#ff4757',
                        }}
                      >
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<ShowChart />}
            sx={{
              background: 'linear-gradient(45deg, #00d4aa, #00a37a)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00a37a, #008f6b)',
              },
            }}
          >
            Start Trading
          </Button>
          <Button
            variant="outlined"
            startIcon={<AccountBalance />}
            sx={{
              borderColor: '#00d4aa',
              color: '#00d4aa',
              '&:hover': {
                borderColor: '#00a37a',
                backgroundColor: 'rgba(0, 212, 170, 0.1)',
              },
            }}
          >
            View Portfolio
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShowChart />}
            sx={{
              borderColor: '#3742fa',
              color: '#3742fa',
              '&:hover': {
                borderColor: '#2f3542',
                backgroundColor: 'rgba(55, 66, 250, 0.1)',
              },
            }}
          >
            Market Analysis
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
