import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import datetime

# Import your application and database objects
from backend.config import settings
from backend.database import Base, get_db
from backend.main import app
from backend import models
from backend.routers.oauth2 import create_access_token
from backend.utils import hash_password


test_db_url = settings.TEST_SQLALCHEMY_DB_URL

engine = create_engine(test_db_url)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def setup_database():
    """
    Create the tables once for the test session, then drop afterwards.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(setup_database):
    """
    Returns an isolated session for a test and rolls back at the end.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session, monkeypatch):
    """
    Provide a TestClient that uses the `db_session` fixture instead of the real database.
    """

    # override the get_db dependency
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function")
def test_user(db_session):
    """
    Create a sample user in the database and return it.
    Assumes you have a hashing function or store plaintext for tests.
    """
    user = models.User(
        email="test@example.com",
        full_name="Test User",
        is_admin=False,
        gender="other",
        dob=datetime.date(2000, 1, 1),
        password=hash_password(
            "password123"
        ),  # or hash it if your model hashes automatically
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def authorized_client(client, test_user):
    """
    Returns a client with an Authorization header set for the test_user.
    """
    token = create_access_token({"user_id": str(test_user.id)})
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
