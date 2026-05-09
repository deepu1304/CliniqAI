from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.doctor import Doctor
from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def create_access_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)

    # "exp" is a standard JWT claim — libraries check it automatically
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def authenticate_doctor(db: Session, email: str, password: str) -> Doctor | None:
    doctor = db.query(Doctor).filter(Doctor.email == email).first()
    if not doctor:
        return None
    if not verify_password(password, doctor.password_hash):
        return None
    return doctor

def get_current_doctor(token: str, db: Session) -> Doctor | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        doctor_id: str = payload.get("sub")
        if not doctor_id:
            return None
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()
    except JWTError:
        return None