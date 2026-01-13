import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Skeleton } from '@mui/material';
import { Store, Order } from '../types';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface SummaryCardsProps {
  stores: Store[];
  orders: Order[];
  loading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stores, orders, loading = false }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const totalStores = stores.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count revenue from completed orders
    if (order.status !== 'completed') return sum;
    const amount = typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const cardData = [
    {
      title: 'Total Stores',
      value: loading ? '...' : totalStores,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: StorefrontIcon,
      color: '#fff'
    },
    {
      title: 'Total Orders',
      value: loading ? '...' : totalOrders,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: ShoppingCartIcon,
      color: '#fff'
    },
    {
      title: 'Total Revenue',
      value: loading ? '...' : formatCurrency(totalRevenue),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: TrendingUpIcon,
      color: '#fff'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: card.gradient,
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                },
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9, fontSize: '0.85rem', fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <IconComponent sx={{ fontSize: '28px', opacity: 0.8 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: card.color,
                    fontWeight: 'bold',
                    fontSize: { xs: '1.75rem', md: '2rem' }
                  }}
                >
                  {loading ? <Skeleton width={100} sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} /> : card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
