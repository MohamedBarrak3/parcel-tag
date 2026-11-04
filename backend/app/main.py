from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import Base, engine, SessionLocal, Handler
from app.routes import router

# Placeholder UIDs, same as simulate_tag.py, until Sarah reads the real cards
DEMO_HANDLERS = [
    ("04A1A1A1", "Warehouse A", "warehouse"),
    ("04B2B2B2", "Driver B", "driver"),
    ("04C3C3C3", "Client C", "client"),
]

app = FastAPI(title="Parcel Custody Tag")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    if db.query(Handler).count() == 0:
        for badge_id, name, role in DEMO_HANDLERS:
            db.add(Handler(badge_id=badge_id, name=name, role=role))
        db.commit()

app.include_router(router)
