from datetime import datetime, timedelta, timezone
from typing import Literal
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select, func, delete
from sqlalchemy.orm import Session
from app.models import SessionLocal, Box, Event, Handler
from app.custody import apply_custody

router = APIRouter(prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def rejudge(db, box_id):
    """Run the custody rules again on all events of one box."""
    events = db.scalars(select(Event).where(Event.box_id == box_id)).all()
    roles = {h.badge_id: h.role for h in db.scalars(select(Handler))}
    apply_custody(events, roles)

EventType = Literal["tap", "drop", "impact", "upside_down", "tamper", "temp_breach"]
Role = Literal["warehouse", "driver", "client"]

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

class HandlerIn(BaseModel):
    badge_id: str
    name: str
    role: Role

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
    db.flush()
    rejudge(db, body.box_id)
    db.commit()

    ack = db.scalar(select(func.max(Event.seq)).where(Event.box_id == body.box_id))
    return {"ack_seq": ack or 0}

@router.get("/handlers")
def list_handlers(db: Session = Depends(get_db)):
    return [{"badge_id": h.badge_id, "name": h.name, "role": h.role}
            for h in db.scalars(select(Handler))]

@router.post("/handlers")
def add_handler(body: HandlerIn, db: Session = Depends(get_db)):
    db.merge(Handler(badge_id=body.badge_id, name=body.name, role=body.role))
    db.flush()
    for box_id in db.scalars(select(Box.box_id)):
        rejudge(db, box_id)
    db.commit()
    return body

@router.post("/reset")
def reset(db: Session = Depends(get_db)):
    db.execute(delete(Event))
    db.execute(delete(Box))
    db.commit()
    return {"status": "reset"}
