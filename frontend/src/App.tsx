import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { StoreSelector } from './components/StoreSelector';
import { MetricsCards } from './components/MetricsCards';
import { HealthIndicator } from './components/HealthIndicator';
import { SummaryCards } from './components/SummaryCards';
import { StoreList } from './components/StoreList';
import { OrdersTable } from './components/OrdersTable';
import { apiService } from './services/api';
import { Store, StoreMetrics, HealthScore, Order } from './types';
import './App.css';

function App() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [metrics, setMetrics] = useState<StoreMetrics | null>(null);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stores on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setSummaryLoading(true);
    setError(null);
    try {
      const storesData = await apiService.getStores();
      setStores(storesData || []);
    } catch (err) {
      setError('Failed to fetch stores');
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Fetch metrics and orders when store is selected
  useEffect(() => {
    if (selectedStore) {
      fetchStoreData(selectedStore.id);
      // Set up interval to refresh data every 30 seconds
      const interval = setInterval(() => {
        fetchStoreData(selectedStore.id);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [selectedStore]);

  const fetchStoreData = async (storeId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [metricsData, ordersData] = await Promise.all([
        apiService.getStoreMetrics(storeId),
        apiService.getOrders(storeId, 50)
      ]);
      
      setMetrics(metricsData);
      setOrders(ordersData || []);
    } catch (err) {
      setError('Failed to fetch store data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, color: 'white' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              🍽️ Restaurant Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Monitor and manage all your restaurant operations in real-time
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: 'white',
                    fontSize: '1.1rem'
                  }}
                >
                  Dashboard Summary
                </Typography>
                <SummaryCards stores={stores} orders={orders} loading={summaryLoading} />
              </Box>
            </Grid>

            {/* Store List */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  p: 3
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}
                >
                  All Stores
                </Typography>
                <StoreList stores={stores} loading={summaryLoading} onStoreSelect={setSelectedStore} />
              </Box>
            </Grid>

            {/* Store Selector */}
            {selectedStore && (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,247,250,0.95) 100%)',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    mb: 2
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    Selected Store
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    {selectedStore.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Platform: <strong>{selectedStore.platform.toUpperCase()}</strong> | 
                    Status: <span style={{ color: selectedStore.status === 'online' ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>{selectedStore.status}</span>
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Health Score & Metrics */}
            {selectedStore && (
              <>
                <Grid item xs={12} md={4}>
                  <HealthIndicator 
                    storeId={selectedStore.id}
                    healthScore={healthScore}
                    loading={loading}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <MetricsCards 
                    metrics={metrics}
                    loading={loading}
                  />
                </Grid>
              </>
            )}

            {/* Orders Table */}
            {selectedStore && (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    p: 3
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}
                  >
                    Orders for {selectedStore.name}
                  </Typography>
                  <OrdersTable orders={orders} loading={loading} />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default App;