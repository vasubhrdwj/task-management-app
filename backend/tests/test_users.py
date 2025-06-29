import datetime
import pytest
from fastapi import status


def test_create_user_success(client, db_session):
    payload = {
        "email": "newuser@example.com",
        "full_name": "New User",
        "password": "strongpassword123",
        "gender": "other",
        "dob": "2000-02-15",
        "is_admin": False
    }
    response = client.post("/users/create", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    # Check response fields
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
    assert data["gender"] == payload["gender"]
    assert data["dob"] == payload["dob"]
    assert "id" in data
    assert data.get("is_admin") == payload["is_admin"]

    # Verify user in database
    from backend import models
    user_in_db = db_session.query(models.User).filter(models.User.email == payload["email"]).first()
    assert user_in_db is not None
    assert user_in_db.full_name == payload["full_name"]
    assert user_in_db.gender == payload["gender"]
    assert user_in_db.dob == datetime.date(2000, 2, 15)


def test_create_user_conflict(client, test_user):
    # Attempt to create with an email that already exists
    payload = {
        "email": test_user.email,
        "full_name": "Another Name",
        "password": "anotherpass",
        "gender": test_user.gender,
        "dob": str(test_user.dob),
        "is_admin": test_user.is_admin
    }
    response = client.post("/users/create", json=payload)
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "User Already Exists"