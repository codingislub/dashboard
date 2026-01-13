import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { Order } from '../types';

interface OrdersTableProps {
  orders: Order[];
  loading?: boolean;
  error?: string | null;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, loading = false, error = null }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'warning';
      case 'processing':
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusBackgroundColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4caf50'; // green
      case 'failed':
        return '#f44336'; // red
      case 'cancelled':
        return '#ff9800'; // orange
      case 'processing':
        return '#2196f3'; // blue
      default:
        return '#999';
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">No orders found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Table sx={{ minWidth: 750 }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Platform</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              sx={{
                '&:hover': {
                  backgroundColor: '#f9f9f9'
                },
                transition: 'background-color 0.2s ease'
              }}
            >
              <TableCell sx={{ fontWeight: 500, fontSize: '0.9em' }}>
                {order.id.substring(0, 8)}...
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {order.platform}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                {formatCurrency(order.total_amount)}
              </TableCell>
              <TableCell>
                <Typography variant="body2">{order.items_count} items</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: getStatusBackgroundColor(order.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {formatTime(order.created_at)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
