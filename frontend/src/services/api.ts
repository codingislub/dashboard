import axios from 'axios';
import { Store, Order, StoreMetrics, HealthScore, Anomaly } from '../types';

// API endpoints - use environment variable for production
const BACKEND_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  // Fetch all stores with summary data from backend
  async getStores(): Promise<Store[]> {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/dashboard/summary`);
      return response.data.stores;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  // Fetch store details and orders combined from backend
  async getStoreData(storeId: string): Promise<{ store: any; orders: Order[] }> {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/dashboard/store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store data:', error);
      throw error;
    }
  }

  // Fetch store metrics from backend
  async getStoreMetrics(storeId: string): Promise<StoreMetrics> {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/metrics/store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  // Fetch health score from backend
  async getHealthScore(storeId: string): Promise<HealthScore> {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/health-score/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health score:', error);
      throw error;
    }
  }

  // Fetch orders for a specific store
  async getOrders(storeId: string, limit: number = 20): Promise<Order[]> {
    try {
      const storeData = await this.getStoreData(storeId);
      return storeData.orders.slice(0, limit);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get dashboard summary (total stores, orders, revenue)
  async getDashboardSummary() {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/dashboard/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  // Detect anomalies
  async detectAnomalies(storeId?: string): Promise<Anomaly[]> {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/anomalies/detect`, {
        params: { store_id: storeId }
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();