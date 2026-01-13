from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import httpx
from datetime import datetime, timedelta

from .models import Store, Order, StoreMetrics, HealthScore
from .services import HealthScoreService, AnomalyDetectionService

# Helper function
def is_within_hours(created_at: str, hours: int) -> bool:
    """Check if a timestamp is within the given number of hours"""
    try:
        order_time = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        return datetime.now(order_time.tzinfo) - order_time < timedelta(hours=hours)
    except:
        return False

app = FastAPI(title="Restaurant Dashboard API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock API base URL - use environment variable for production
import os
MOCK_API_URL = os.getenv("MOCK_API_URL", "http://localhost:3001")

# Initialize services
health_service = HealthScoreService()
anomaly_service = AnomalyDetectionService()

@app.get("/")
async def root():
    return {"message": "Restaurant Dashboard API", "version": "1.0.0"}

@app.get("/api/dashboard/store/{store_id}")
async def get_dashboard_store(store_id: str) -> Dict:
    """
    Get store details and orders combined.
    Fetches from mock API and returns combined data.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Fetch store details
            store_response = await client.get(f"{MOCK_API_URL}/api/stores/{store_id}")
            store_response.raise_for_status()
            store_data = store_response.json()
            
            # Fetch store orders
            orders_response = await client.get(f"{MOCK_API_URL}/api/stores/{store_id}/orders")
            orders_response.raise_for_status()
            orders_data = orders_response.json()
            
            return {
                "store": store_data,
                "orders": orders_data.get("orders", [])
            }
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from mock API: {str(e)}")

@app.get("/api/dashboard/summary")
async def get_dashboard_summary() -> Dict:
    """
    Get summary of all stores with counts and revenue.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Fetch all stores
            stores_response = await client.get(f"{MOCK_API_URL}/api/stores")
            stores_response.raise_for_status()
            stores_data = stores_response.json()
            
            stores = stores_data.get("stores", [])
            total_stores = len(stores)
            total_revenue = 0
            total_orders = 0
            
            # Fetch orders for each store to calculate summary
            for store in stores:
                try:
                    orders_response = await client.get(f"{MOCK_API_URL}/api/stores/{store['id']}/orders")
                    if orders_response.status_code == 200:
                        orders_data = orders_response.json()
                        orders = orders_data.get("orders", [])
                        total_orders += len(orders)
                        
                        # Sum up revenue from all orders
                        for order in orders:
                            total_revenue += order.get("total_amount", 0)
                except:
                    pass  # Skip if individual store fails
            
            return {
                "total_stores": total_stores,
                "total_orders": total_orders,
                "total_revenue": total_revenue,
                "stores": stores
            }
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from mock API: {str(e)}")

@app.get("/api/metrics/store/{store_id}")
async def get_store_metrics(store_id: str) -> StoreMetrics:
    """
    Get performance metrics for a specific store.
    Fetches orders and calculates metrics.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Fetch store details
            store_response = await client.get(f"{MOCK_API_URL}/api/stores/{store_id}")
            store_response.raise_for_status()
            
            # Fetch store orders
            orders_response = await client.get(f"{MOCK_API_URL}/api/stores/{store_id}/orders")
            orders_response.raise_for_status()
            orders_data = orders_response.json()
            
            orders = orders_data.get("orders", [])
            
            # Calculate metrics
            total_orders_24h = len(orders)
            total_orders_1h = sum(1 for o in orders if is_within_hours(o.get("created_at"), 1))
            completed_orders = sum(1 for o in orders if o.get("status") == "completed")
            failed_orders = sum(1 for o in orders if o.get("status") == "failed")
            cancelled_orders = sum(1 for o in orders if o.get("status") == "cancelled")
            
            success_rate = (completed_orders / total_orders_24h * 100) if total_orders_24h > 0 else 0
            failure_rate = (failed_orders / total_orders_24h * 100) if total_orders_24h > 0 else 0
            
            total_revenue = sum(float(o.get("total_amount", 0)) for o in orders)
            avg_order_value = (total_revenue / total_orders_24h) if total_orders_24h > 0 else 0
            
            processing_times = [o.get("processing_time_seconds", 0) for o in orders if o.get("processing_time_seconds")]
            avg_processing_time_seconds = sum(processing_times) / len(processing_times) if processing_times else 0
            avg_processing_time_minutes = avg_processing_time_seconds / 60
            
            orders_per_hour = (total_orders_24h / 24) if total_orders_24h > 0 else 0
            
            error_breakdown = {}
            for order in orders:
                if order.get("has_error"):
                    error_type = order.get("error_type", "unknown")
                    error_breakdown[error_type] = error_breakdown.get(error_type, 0) + 1
            
            return StoreMetrics(
                store_id=store_id,
                total_orders_24h=total_orders_24h,
                total_orders_1h=total_orders_1h,
                success_rate=success_rate,
                failure_rate=failure_rate,
                avg_processing_time_minutes=avg_processing_time_minutes,
                total_revenue_24h=total_revenue,
                avg_order_value=avg_order_value,
                orders_per_hour=orders_per_hour,
                error_breakdown=error_breakdown,
                timestamp=datetime.now()
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from mock API: {str(e)}")

@app.get("/api/health-score/{store_id}")
async def get_health_score(store_id: str) -> HealthScore:
    """
    Calculate and return health score for a store.
    This is where you implement your custom algorithm!
    """
    # TODO: Implement your health score algorithm
    # Consider factors like:
    # - Order success rate
    # - Processing time vs average
    # - Revenue trends
    # - Order volume
    # - Error patterns
    
    # For now, return a placeholder
    return HealthScore(
        store_id=store_id,
        score=75,
        status="healthy",
        factors={
            "success_rate": 85,
            "processing_time": 70,
            "revenue_trend": 75
        },
        timestamp=datetime.now()
    )

@app.get("/api/anomalies/detect")
async def detect_anomalies(store_id: Optional[str] = None) -> List[Dict]:
    """
    Detect operational anomalies across stores.
    """
    # TODO: Implement anomaly detection
    # Check for:
    # - High failure rates (>20%)
    # - Processing time >2x average
    # - No orders for >10 minutes
    
    anomalies = anomaly_service.detect_anomalies(store_id)
    return anomalies

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)