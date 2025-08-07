from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import re
import httpx
import asyncio
from passlib.context import CryptContext
from jose import JWTError, jwt
from email_validator import validate_email, EmailNotValidError
import stripe
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Authentication configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# Stripe configuration
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# SendGrid configuration
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "otcpublishing@gmail.com")
FROM_NAME = os.getenv("FROM_NAME", "AI Writing Detector")
sendgrid_client = SendGridAPIClient(api_key=SENDGRID_API_KEY) if SENDGRID_API_KEY else None

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class GoogleDocRequest(BaseModel):
    doc_url: str

class GoogleDocResponse(BaseModel):
    success: bool
    content: Optional[str] = None
    error: Optional[str] = None
    doc_id: Optional[str] = None
    title: Optional[str] = None
  # User Authentication Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    trial_start: datetime
    trial_expires: datetime
    subscription_status: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class UsageRecord(BaseModel):
    user_id: str
    analysis_date: datetime = Field(default_factory=datetime.utcnow)
    analysis_type: str  # 'file' or 'google-doc'
    file_size: Optional[int] = None
    processing_time: Optional[float] = None

# Stripe Models
class CreateCheckoutSession(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str

class SubscriptionInfo(BaseModel):
    has_active_subscription: bool
    subscription_status: Optional[str] = None
    current_period_end: Optional[datetime] = None
    plan_name: Optional[str] = None

# Email utility functions
async def send_email(to_email: str, subject: str, html_content: str, text_content: str = None):
    """Send email using SendGrid"""
    if not sendgrid_client:
        logger.error("SendGrid client not configured")
        return False
    
    try:
        message = Mail(
            from_email=(FROM_EMAIL, FROM_NAME),
            to_emails=to_email,
            subject=subject,
            html_content=html_content,
            plain_text_content=text_content or ""
        )
        
        response = sendgrid_client.send(message)
        logger.info(f"Email sent successfully to {to_email}, status: {response.status_code}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False
     
```python

def get_welcome_email_template(user_email: str, trial_expires: datetime):
    """Generate welcome email HTML template"""
    days_left = (trial_expires - datetime.utcnow()).days
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to AI Writing Detector</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: white; padding: 30px; border: 1px solid #e1e5e9; }}
            .footer {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }}
            .button {{ display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }}
            .trial-badge {{ background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to AI Writing Detector!</h1>
                <p>Your 3-day free trial has started</p>
            </div>
            
            <div class="content">
                <p>Hi there!</p>
                
                <p>Welcome to AI Writing Detector! Your <span class="trial-badge">{days_left}-day free trial</span> is now active and you have unlimited access to all features.</p>
                
                <h3>🚀 What you can do right now:</h3>
                <ul>
                    <li><strong>Upload documents</strong> - Analyze TXT, DOC, DOCX, RTF files</li>
                    <li><strong>Google Docs integration</strong> - Paste any Google Doc URL for instant analysis</li>
                    <li><strong>Advanced AI detection</strong> - 11 different pattern analysis methods</li>
                    <li><strong>Detailed reporting</strong> - Get insights into writing characteristics</li>
                </ul>
                
                <p>Best regards,<br>The AI Writing Detector Team</p>
            </div>
            
            <div class="footer">
                <p>Your trial expires in {days_left} days. Upgrade anytime for unlimited access!</p>
                <p>© 2025 AI Writing Detector</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to AI Writing Detector!
    
    Your {days_left}-day free trial has started and you have unlimited access to all features.
    
    What you can do:
    - Upload documents (TXT, DOC, DOCX, RTF)
    - Analyze Google Docs by URL
    - Advanced AI pattern detection
    - Detailed reporting
    
    Best regards,
    The AI Writing Detector Team
    """
    
    return html_content, text_content

# Authentication utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await get_user_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
```async def check_user_access(user: dict) -> bool:
    """Check if user has access to analyze documents"""
    subscription_status = user["subscription_status"]
    
    # Active paid subscriptions have unlimited access
    if subscription_status in ["active", "pro", "business"]:
        return True
    
    # Past due subscriptions lose access
    if subscription_status in ["expired", "past_due", "canceled"]:
        return False
    
    # Trial users - check if trial has expired
    if subscription_status == "trial":
        now = datetime.utcnow()
        trial_expires = user["trial_expires"]
        if isinstance(trial_expires, str):
            trial_expires = datetime.fromisoformat(trial_expires.replace('Z', '+00:00'))
        if now > trial_expires:
            # Update user status to expired
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"subscription_status": "expired"}}
            )
            return False
    
    return True

# Google Docs utility functions
def extract_google_doc_id(url: str) -> Optional[str]:
    """Extract Google Doc ID from various URL formats"""
    patterns = [
        r'/document/d/([a-zA-Z0-9-_]+)',
        r'id=([a-zA-Z0-9-_]+)',
        r'/d/([a-zA-Z0-9-_]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

async def fetch_google_doc_content(doc_id: str) -> dict:
    """Fetch content from a public Google Doc"""
    try:
        # Use the export URL to get plain text content
        export_url = f"https://docs.google.com/document/d/{doc_id}/export?format=txt"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(export_url)
            
            if response.status_code == 200:
                content = response.text
                if len(content.strip()) < 10:
                    return {
                        "success": False,
                        "error": "Document appears to be empty or inaccessible"
                    }
                
                return {
                    "success": True,
                    "content": content,
                    "doc_id": doc_id
                }
            elif response.status_code == 404:
                return {
                    "success": False,
                    "error": "Document not found. Please check the URL."
                }
            elif response.status_code == 403:
                return {
                    "success": False,
                    "error": "Document is private or permission denied. Please make sure the document is shared with 'Anyone with the link can view'."
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to access document. Status code: {response.status_code}"
                }
                
    except httpx.TimeoutException:
        return {
            "success": False,
            "error": "Request timeout. The document may be too large or Google Docs is temporarily unavailable."
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Error fetching document: {str(e)}"
        }

# FastAPI App Setup
app = FastAPI(
    title="AI Writing Detector API",
    description="Advanced AI writing pattern detection with Google Docs integration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# Health Check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Authentication endpoints
@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Sign up a new user and start their 3-day trial"""
    # Check if user already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Password validation
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    # Create user with 3-day trial
    now = datetime.utcnow()
    trial_expires = now + timedelta(days=3)
    
    user_dict = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "password_hash": get_password_hash(user_data.password),
        "trial_start": now,
        "trial_expires": trial_expires,
        "subscription_status": "trial",
        "created_at": now
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    # Send welcome email
    try:
        html_content, text_content = get_welcome_email_template(user_data.email, trial_expires)
        await send_email(
            user_data.email,
            "Welcome to AI Writing Detector - Your Free Trial Started!",
            html_content,
            text_content
        )
    except Exception as e:
        logger.error(f"Failed to send welcome email: {str(e)}")
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    user_response = UserResponse(
        id=user_dict["id"],
        email=user_dict["email"],
        trial_start=user_dict["trial_start"],
        trial_expires=user_dict["trial_expires"],
        subscription_status=user_dict["subscription_status"],
        created_at=user_dict["created_at"]
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login existing user"""
    user = await get_user_by_email(user_data.email)
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        trial_start=user["trial_start"],
        trial_expires=user["trial_expires"],
        subscription_status=user["subscription_status"],
        created_at=user["created_at"]
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        trial_start=current_user["trial_start"],
        trial_expires=current_user["trial_expires"],
        subscription_status=current_user["subscription_status"],
        created_at=current_user["created_at"]
    )

# Stripe endpoints
@api_router.get("/stripe/config")
async def get_stripe_config():
    """Get Stripe publishable key for frontend"""
    return {"publishable_key": STRIPE_PUBLISHABLE_KEY}

# Google Docs endpoint
@api_router.post("/analyze-google-doc", response_model=GoogleDocResponse)
async def analyze_google_doc(request: GoogleDocRequest, current_user: dict = Depends(get_current_user)):
    """
    Fetch content from a public Google Doc URL and return the text content.
    Frontend will handle the actual AI analysis. Requires authentication.
    """
    try:
        # Check user access
        has_access = await check_user_access(current_user)
        
        if not has_access:
            if current_user["subscription_status"] == "trial":
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="Your 3-day trial has expired. Please upgrade to continue using the service."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="Your subscription has expired. Please renew to continue using the service."
                )
        
        # Extract document ID from URL
        doc_id = extract_google_doc_id(request.doc_url)
        
        if not doc_id:
            raise HTTPException(
                status_code=400, 
                detail="Invalid Google Docs URL. Please provide a valid Google Docs link."
            )
        
        # Fetch document content
        result = await fetch_google_doc_content(doc_id)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        # Record usage
        usage_record = {
            "user_id": current_user["id"],
            "analysis_date": datetime.utcnow(),
            "analysis_type": "google-doc",
            "file_size": len(result["content"]) if result["content"] else 0
        }
        await db.usage.insert_one(usage_record)
        
        return GoogleDocResponse(
            success=True,
            content=result["content"],
            doc_id=doc_id,
            title=f"Google Doc {doc_id[:8]}..."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze_google_doc: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while processing Google Doc"
        )

app.include_router(api_router)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
