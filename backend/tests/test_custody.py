from dataclasses import dataclass
from app.custody import apply_custody, liable

A, B, C = "A", "B", "C"
ROLES = {A: "warehouse", B: "driver", C: "client"}

@dataclass
class Ev:
    seq: int
    uptime_ms: int
    type: str
    height_m: float | None = None
    badge_id: str | None = None
    holder_badge_id: str | None = None
    severity: str | None = None
    expected: bool = False

def tap(seq, t, badge):
    return Ev(seq, t, "tap", badge_id=badge)

def ev(seq, t, type, height=None):
    return Ev(seq, t, type, height_m=height)

def run(*events):
    result, handovers = apply_custody(list(events), ROLES)
    return {e.seq: e for e in result}, handovers

def test_1_drop_after_tap_b():
    r, _ = run(tap(1, 1000, B), ev(2, 5000, "drop", 0.8))
    assert r[2].holder_badge_id == B

def test_2_drop_before_any_tap():
    r, _ = run(ev(1, 1000, "drop", 0.8))
    assert r[1].holder_badge_id is None

def test_3_tap_a_tap_b_then_drop():
    r, _ = run(tap(1, 1000, A), tap(2, 5000, B), ev(3, 9000, "drop", 0.8))
    assert r[3].holder_badge_id == B

def test_4_same_badge_twice_within_2s_ignored():
    _, handovers = run(tap(1, 1000, A), tap(2, 5000, B), tap(3, 6000, B))
    assert handovers == [(1, A), (2, B)]

def test_5_tamper_while_client_holds_is_expected():
    r, _ = run(tap(1, 1000, C), ev(2, 3000, "tamper"))
    assert r[2].expected is True
    assert r[2].severity == "info"

def test_6_tamper_while_driver_holds_is_severe():
    r, _ = run(tap(1, 1000, B), ev(2, 3000, "tamper"))
    assert r[2].severity == "severe"
    assert liable(r.values()) == [{"badge_id": B, "reason": "tamper"}]

def test_9_temp_breach_after_tap_b_is_warning():
    r, _ = run(tap(1, 1000, B), ev(2, 3000, "temp_breach"))
    assert r[2].severity == "warning"
    assert r[2].holder_badge_id == B
