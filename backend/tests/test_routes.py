from test_custody import make_client, upload

STORY = [
    {"seq": 1, "uptime_ms": 1000, "type": "tap", "badge_id": "B"},
    {"seq": 2, "uptime_ms": 4000, "type": "drop", "height_m": 0.8},
    {"seq": 3, "uptime_ms": 8000, "type": "tap", "badge_id": "C"},
]

def add_people(client):
    client.post("/api/handlers", json={"badge_id": "B", "name": "Driver B", "role": "driver"})
    client.post("/api/handlers", json={"badge_id": "C", "name": "Client C", "role": "client"})

def test_handlers_post_then_get():
    client, _ = make_client()
    add_people(client)
    names = {h["badge_id"]: h["name"] for h in client.get("/api/handlers").json()}
    assert names == {"B": "Driver B", "C": "Client C"}

def test_boxes_shows_status_and_current_holder():
    client, _ = make_client()
    add_people(client)
    upload(client, STORY)
    boxes = client.get("/api/boxes").json()
    assert len(boxes) == 1
    assert boxes[0]["status"] == "severe"
    assert boxes[0]["current_holder"] == {"badge_id": "C", "name": "Client C", "role": "client"}
    assert boxes[0]["last_event_time"].endswith("Z")

def test_timeline_liable_has_holder_name():
    client, _ = make_client()
    add_people(client)
    upload(client, STORY)
    t = client.get("/api/boxes/B001/timeline").json()
    assert t["liable"] == [{"badge_id": "B", "name": "Driver B", "reason": "drop 0.8 m"}]
    assert [e["holder"]["name"] for e in t["events"]] == ["Driver B", "Driver B", "Client C"]

def test_timeline_unknown_box_is_404():
    client, _ = make_client()
    assert client.get("/api/boxes/B999/timeline").status_code == 404

def test_reset_clears_everything():
    client, _ = make_client()
    upload(client, STORY)
    client.post("/api/reset")
    assert client.get("/api/boxes").json() == []

def test_registering_client_later_makes_tamper_expected():
    client, _ = make_client()
    upload(client, [
        {"seq": 1, "uptime_ms": 1000, "type": "tap", "badge_id": "C"},
        {"seq": 2, "uptime_ms": 3000, "type": "tamper"},
    ])
    add_people(client)  # C becomes a client after the upload
    t = client.get("/api/boxes/B001/timeline").json()
    assert t["events"][1]["expected"] is True
    assert t["status"] == "ok"
