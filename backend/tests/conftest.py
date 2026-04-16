"""
conftest.py — test fixtures for the ticketing-system backend.

Sets up environment variables and patches pgvector / PostgreSQL-specific
types BEFORE any app code is imported, so the whole suite runs against an
in-memory SQLite database without needing a live PostgreSQL server.
"""
import os
import sys
import types

# ─── 1. Env vars (must happen before pydantic-settings validates config) ───
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_ticketing.db")
os.environ.setdefault("GEMINI_API_KEY", "test-api-key-for-testing")

# ─── 2. Mock pgvector (SQLite has no vector type) ──────────────────────────
import json  # noqa: E402
from sqlalchemy import Text  # noqa: E402 — import after env vars are set
from sqlalchemy.types import TypeDecorator  # noqa: E402

class _FakeVector(TypeDecorator):
    """Serializes float lists as JSON text for SQLite testing (replaces pgvector.Vector)."""
    impl = Text
    cache_ok = True

    def __init__(self, dim=None):
        super().__init__()

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return json.loads(value)

_pgvector_mod = types.ModuleType("pgvector")
_pgvector_sa_mod = types.ModuleType("pgvector.sqlalchemy")
_pgvector_sa_mod.Vector = _FakeVector
_pgvector_mod.sqlalchemy = _pgvector_sa_mod
sys.modules.setdefault("pgvector", _pgvector_mod)
sys.modules.setdefault("pgvector.sqlalchemy", _pgvector_sa_mod)

# ─── 3. Now safe to import app code ────────────────────────────────────────
import pytest  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db.database import Base, get_db, engine as _app_engine  # noqa: E402
from main import app  # noqa: E402

# ─── 4. Create a SQLite test engine ────────────────────────────────────────
_TEST_DB_URL = "sqlite:///./test_ticketing.db"
_test_engine = create_engine(_TEST_DB_URL, connect_args={"check_same_thread": False})
_TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=_test_engine)


def _override_get_db():
    db = _TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    """Create all tables once per test session, drop them afterwards."""
    Base.metadata.create_all(bind=_test_engine)
    yield
    Base.metadata.drop_all(bind=_test_engine)
    _test_engine.dispose()
    _app_engine.dispose()
    if os.path.exists("./test_ticketing.db"):
        os.remove("./test_ticketing.db")


@pytest.fixture(autouse=True)
def clear_tables():
    """Wipe all rows between tests to keep them independent."""
    yield
    db = _TestingSession()
    try:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()
    finally:
        db.close()
