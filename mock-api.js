const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data - actual store structure
const mockStores = [
  {
    id: "store_0001",
    name: "Five Guys West",
    chain: "fiveguys",
    slug: "fiveguys_west_doordash",
    platform: "doordash",
    status: "online",
    location: {
      address: "3987 West St",
      city: "San Jose",
      state: "CA",
      zip: "90692",
      lat: 34.4323957137731,
      lng: -118.978058754816
    },
    metrics: {
      avg_order_time: 27,
      avg_order_value: 29,
      daily_orders: 196,
      success_rate: 98
    },
    created_at: "2024-11-15T08:24:30.230Z"
  },
  {
    id: "store_0002",
    name: "Five Guys West",
    chain: "fiveguys",
    slug: "fiveguys_west_ubereats",
    platform: "ubereats",
    status: "online",
    location: {
      address: "4414 West St",
      city: "San Jose",
      state: "CA",
      zip: "90480",
      lat: 34.9301525703654,
      lng: -118.445746888491
    },
    metrics: {
      avg_order_time: 14,
      avg_order_value: 40,
      daily_orders: 106,
      success_rate: 92
    },
    created_at: "2025-08-13T08:26:06.897Z"
  },
  {
    id: "store_0003",
    name: "Five Guys West",
    chain: "fiveguys",
    slug: "fiveguys_west_grubhub",
    platform: "grubhub",
    status: "online",
    location: {
      address: "5422 West St",
      city: "San Jose",
      state: "CA",
      zip: "90953",
      lat: 34.6473709025863,
      lng: -117.60436128914
    },
    metrics: {
      avg_order_time: 14,
      avg_order_value: 40,
      daily_orders: 79,
      success_rate: 86
    },
    created_at: "2025-08-04T16:37:50.305Z"
  }
];

// Mock orders for store_0001
const mockOrders = {
  "store_0001": [
    {
      id: "order_1765037743362",
      store_id: "store_0001",
      store_name: "Five Guys West",
      platform: "doordash",
      status: "failed",
      total_amount: "39.92",
      items_count: 5,
      created_at: "2025-12-06T16:15:43.362Z",
      processing_time_seconds: 1944,
      has_error: true,
      error_type: "processing_error"
    },
    {
      id: "order_1765037077695_2",
      store_id: "store_0001",
      store_name: "Five Guys West",
      platform: "doordash",
      platform_order_id: "doordash_qhtj8wx9s",
      status: "completed",
      total_amount: 59,
      platform_fee: 10,
      tax: 3,
      tip: 5,
      items_count: 3,
      customer: { id: "cust_5439", rating: "4.1" },
      delivery: { estimated_time: 30, actual_time: 26, driver_wait_time: 3 },
      has_error: false,
      error_type: null,
      created_at: "2025-12-06T16:04:37.695Z",
      completed_at: "2025-12-06T16:04:37.695Z",
      processing_time_seconds: 1259
    },
    {
      id: "order_1765037077695_1",
      store_id: "store_0001",
      store_name: "Five Guys West",
      platform: "doordash",
      platform_order_id: "doordash_udpjmcuhk",
      status: "completed",
      total_amount: 18,
      platform_fee: 8,
      tax: 5,
      tip: 4,
      items_count: 3,
      customer: { id: "cust_4576", rating: "3.2" },
      delivery: { estimated_time: 30, actual_time: 29, driver_wait_time: 4 },
      has_error: false,
      error_type: null,
      created_at: "2025-12-06T16:04:37.695Z",
      completed_at: "2025-12-06T16:04:37.695Z",
      processing_time_seconds: 1769
    },
    {
      id: "order_1765037077695_0",
      store_id: "store_0001",
      store_name: "Five Guys West",
      platform: "doordash",
      platform_order_id: "doordash_7q140zavg",
      status: "failed",
      total_amount: 32,
      platform_fee: 6,
      tax: 3,
      tip: 4,
      items_count: 2,
      customer: { id: "cust_9367", rating: "4.3" },
      delivery: { estimated_time: 30, actual_time: null, driver_wait_time: 7 },
      has_error: true,
      error_type: "processing_error",
      created_at: "2025-12-06T16:04:37.695Z",
      completed_at: null,
      processing_time_seconds: 858
    },
    {
      id: "order_1765036161092",
      store_id: "store_0001",
      store_name: "Five Guys West",
      platform: "doordash",
      status: "cancelled",
      total_amount: "43.76",
      items_count: 1,
      created_at: "2025-12-06T15:49:21.092Z",
      processing_time_seconds: 672,
      has_error: true,
      error_type: "processing_error"
    }
  ],
  "store_0002": [
    {
      id: "order_2_1",
      store_id: "store_0002",
      store_name: "Five Guys West",
      platform: "ubereats",
      status: "completed",
      total_amount: 45.50,
      items_count: 3,
      created_at: "2025-12-06T16:00:00.000Z",
      processing_time_seconds: 1200,
      has_error: false
    }
  ],
  "store_0003": [
    {
      id: "order_3_1",
      store_id: "store_0003",
      store_name: "Five Guys West",
      platform: "grubhub",
      status: "completed",
      total_amount: 52.75,
      items_count: 4,
      created_at: "2025-12-06T15:45:00.000Z",
      processing_time_seconds: 1500,
      has_error: false
    }
  ]
};

// GET /api/stores - List all stores
app.get('/api/stores', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;
  
  res.json({
    stores: mockStores.slice(offset, offset + limit),
    total: mockStores.length,
    limit: limit,
    offset: offset
  });
});

// GET /api/stores/:storeId - Store details
app.get('/api/stores/:storeId', (req, res) => {
  const store = mockStores.find(s => s.id === req.params.storeId);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  res.json(store);
});

// GET /api/stores/:storeId/orders - Store orders
app.get('/api/stores/:storeId/orders', (req, res) => {
  const orders = mockOrders[req.params.storeId] || [];
  res.json({
    orders: orders,
    total: orders.length
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
