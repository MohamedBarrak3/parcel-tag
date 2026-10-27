from datetime import datetime, timedelta, timezone
from typing import Literal
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models import SessionLocal, Box, Event

router = APIRouter(prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

EventType = Literal["tap", "drop", "impact", "upside_down", "tamper", "temp_breach"]

class EventIn(BaseModel):
    box_id: str | None = None
    seq: int
    uptime_ms: int
    type: EventType
    conf: float | None = None
    height_m: float | None = None
    temp_c: float | None = None
    hum_pct: float | None = None
    badge_id: str | None = None

class UploadIn(BaseModel):
    box_id: str
    uploaded_at_uptime_ms: int
    events: list[EventIn]

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/upload")
def upload(body: UploadIn, db: Session = Depends(get_db)):
    received = datetime.now(timezone.utc)

    if db.get(Box, body.box_id) is None:
        db.add(Box(box_id=body.box_id, first_seen=received))

    known = set(db.scalars(select(Event.seq).where(Event.box_id == body.box_id)))

    for e in sorted(body.events, key=lambda e: e.seq):
        if e.seq in known:
            continue
        known.add(e.seq)
        ago_ms = body.uploaded_at_uptime_ms - e.uptime_ms
        db.add(Event(
            box_id=body.box_id, seq=e.seq, uptime_ms=e.uptime_ms,
            event_time=received - timedelta(milliseconds=ago_ms),
            type=e.type, conf=e.conf, height_m=e.height_m,
            temp_c=e.temp_c, hum_pct=e.hum_pct, badge_id=e.badge_id,
        ))
    db.commit()

    ack = db.scalar(select(func.max(Event.seq)).where(Event.box_id == body.box_id))
    return {"ack_seq": ack or 0}
