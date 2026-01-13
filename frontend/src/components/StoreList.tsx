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
import { Store } from '../types';

interface StoreListProps {
  stores: Store[];
  loading?: boolean;
  onStoreSelect?: (store: Store) => void;
}

export const StoreList: React.FC<StoreListProps> = ({ stores, loading = false, onStoreSelect }) => {
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'online':
        return 'success';
      case 'busy':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      doordash: '#ff6b35',
      ubereats: '#000000',
      grubhub: '#ff5733'
    };
    return colors[platform] || '#999';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (stores.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">No stores found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Store Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Platform</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store) => (
            <TableRow
              key={store.id}
              onClick={() => onStoreSelect?.(store)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f9f9f9'
                },
                transition: 'background-color 0.2s ease'
              }}
            >
              <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
              <TableCell>
                <Chip
                  label={store.platform.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: getPlatformColor(store.platform),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={store.status.toUpperCase()}
                  size="small"
                  color={getStatusColor(store.status)}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                {store.location?.address && (
                  <Typography variant="body2" color="textSecondary">
                    {store.location.city}, {store.location.state}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
