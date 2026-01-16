from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class MonobankInfo(BaseModel):
    link: str
    cardNumber: str
    iban: str

class CryptoInfo(BaseModel):
    usdt_trc20: str

class SocialInfo(BaseModel):
    instagram: str
    facebook: str
    telegram: Optional[str] = ""

class FundraisingData(BaseModel):
    totalRaised: float
    goalAmount: float
    donorCount: int
    monobank: MonobankInfo
    crypto: CryptoInfo
    social: SocialInfo
    updatedAt: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class FundraisingUpdate(BaseModel):
    adminPassword: str
    totalRaised: float
    goalAmount: float
    donorCount: int
    monobank: MonobankInfo
    crypto: CryptoInfo
    social: SocialInfo

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# Initialize database with default data
async def init_fundraising_data():
    existing = await db.fundraising_data.find_one()
    if not existing:
        default_data = {
            "totalRaised": 125000,
            "goalAmount": 500000,
            "donorCount": 347,
            "monobank": {
                "link": "https://send.monobank.ua/jar/4g2vud36xP",
                "cardNumber": "5375 4141 0123 4567",
                "iban": "UA123456789012345678901234567"
            },
            "crypto": {
                "usdt_trc20": "TXqwertyuiopasdfghjklzxcvbnm123456"
            },
            "social": {
                "instagram": "https://instagram.com/unit406",
                "facebook": "https://facebook.com/unit406"
            },
            "updatedAt": datetime.now(timezone.utc),
            "createdAt": datetime.now(timezone.utc)
        }
        await db.fundraising_data.insert_one(default_data)
        logger.info("Initialized default fundraising data")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/fundraising", response_model=FundraisingData)
async def get_fundraising_data():
    """Get current fundraising data (public endpoint)"""
    data = await db.fundraising_data.find_one()
    if not data:
        raise HTTPException(status_code=404, detail="Fundraising data not found")
    
    # Remove MongoDB _id field
    data.pop('_id', None)
    data.pop('createdAt', None)
    
    return FundraisingData(**data)

@api_router.put("/fundraising")
async def update_fundraising_data(update: FundraisingUpdate):
    """Update fundraising data (admin only)"""
    # Verify admin password
    admin_password = os.environ.get('ADMIN_PASSWORD')
    if not admin_password:
        raise HTTPException(status_code=500, detail="Admin password not configured")
    if update.adminPassword != admin_password:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    
    # Prepare update data
    update_dict = update.model_dump()
    update_dict.pop('adminPassword')
    update_dict['updatedAt'] = datetime.now(timezone.utc)
    
    # Update in database
    result = await db.fundraising_data.update_one(
        {},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update data")
    
    return {
        "success": True,
        "message": "Дані успішно оновлено",
        "data": update_dict
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_fundraising_data()
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()