import argparse
import httpx

# Real demo badges read by Sarah
A, B, C = "17733800", "4BBEF804", "53A0B3A7"

def ev(box, seq, uptime_ms, type, temp=24.0, **extra):
    e = {"box_id": box, "seq": seq, "uptime_ms": uptime_ms, "type": type,
         "conf": None, "height_m": None, "temp_c": temp, "hum_pct": 50,
         "badge_id": None}
    e.update(extra)
    return e

def scenario(box):
    return {
        "box_id": box,
        "uploaded_at_uptime_ms": 22000,
        "events": [
            ev(box, 1, 1000, "tap", badge_id=A),
            ev(box, 2, 5000, "tap", badge_id=B),
            ev(box, 3, 9000, "drop", conf=0.93, height_m=0.8),
            ev(box, 4, 12000, "tamper"),
            ev(box, 5, 15000, "temp_breach", temp=33.0),
            ev(box, 6, 20000, "tap", badge_id=C),
        ],
    }

def send(url, body):
    r = httpx.post(f"{url}/api/upload", json=body, timeout=5)
    r.raise_for_status()
    print("ack_seq:", r.json()["ack_seq"])

if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Pretend to be the parcel tag")
    p.add_argument("--url", default="http://localhost:8000")
    p.add_argument("--box", default="B001")
    p.add_argument("--repeat", action="store_true", help="send the same batch twice")
    args = p.parse_args()

    body = scenario(args.box)
    send(args.url, body)
    if args.repeat:
        send(args.url, body)
