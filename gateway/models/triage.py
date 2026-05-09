import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
import enum

class TriageStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"

class TriageSession(Base):
    __tablename__ = "triage_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id: Mapped[str] = mapped_column(String, ForeignKey("patients.id"), nullable=False)
    doctor_id: Mapped[str] = mapped_column(String, ForeignKey("doctors.id"), nullable=True)
    symptoms_raw: Mapped[str] = mapped_column(Text, nullable=True)

    symptoms_json: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[TriageStatus] = mapped_column(
        Enum(TriageStatus), default=TriageStatus.pending
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(String, ForeignKey("triage_sessions.id"), nullable=False)
    urgency_level: Mapped[int] = mapped_column(Integer, nullable=True)

    conditions_json: Mapped[str] = mapped_column(Text, nullable=True)
    shap_values_json: Mapped[str] = mapped_column(Text, nullable=True)
    model_version: Mapped[str] = mapped_column(String(50), nullable=True)
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)