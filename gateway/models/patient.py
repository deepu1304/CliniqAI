import uuid
from datetime import datetime, date
from sqlalchemy import String, Date, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=True)
    blood_type: Mapped[str] = mapped_column(String(5), nullable=True)

    # PostgreSQL ARRAY would be ideal here but TEXT is portable across DB engines
    chronic_conditions: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)