import datetime
import pytest
from fastapi import status
import backend.models as models
from backend.utils import hash_password
from uuid import uuid4, UUID


def test_create_user_success(client, db_session):
    payload = {
        "email": "newuser@example.com",
        "full_name": "New User",
        "password": "strongpassword123",
        "gender": "other",
        "dob": "2000-02-15",
        "is_admin": False,
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

    user_in_db = (
        db_session.query(models.User)
        .filter(models.User.email == payload["email"])
        .first()
    )
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
        "is_admin": test_user.is_admin,
    }
    response = client.post("/users/create", json=payload)
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "User Already Exists"


def test_read_users_me_success(authorized_client, test_user):
    """
    GIVEN an authorized client
    WHEN GET /me is called
    THEN it should return status 200 and the current user's data
    """
    res = authorized_client.get("/users/me")
    assert res.status_code == status.HTTP_200_OK

    data = res.json()

    assert data["email"] == test_user.email
    assert "id" in data
    assert data["id"] == str(test_user.id)


def test_read_users_me_unauthorized(client):
    """
    GIVEN an unauthorized (no-token) client
    WHEN GET /me is called
    THEN it should return a 401
    """
    res = client.get("/users/me")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED
    # Optional: check the error detail
    assert res.json()["detail"] == "Not authenticated"


def test_get_user_by_id_success(client, test_user):
    """
    GIVEN an existing user in the DB
    WHEN GET /users/byid/{id} is called with that user's ID
    THEN it should return 202 and the correct user data
    """
    url = f"/users/byid/{test_user.id}"
    res = client.get(url)
    assert res.status_code == status.HTTP_202_ACCEPTED

    data = res.json()
    assert data["email"] == test_user.email
    assert data["id"] == str(test_user.id)
    assert data.get("full_name") == test_user.full_name


def test_get_user_by_id_not_found(client):
    """
    GIVEN no user with the given random UUID
    WHEN GET /users/byid/{id} is called
    THEN it should return 404 with the proper detail message
    """
    random_id = uuid4()
    url = f"/users/byid/{random_id}"
    res = client.get(url)
    assert res.status_code == status.HTTP_404_NOT_FOUND

    body = res.json()

    expected = f"user with email:{random_id} not found"
    assert body["detail"] == expected


def test_get_user_by_email_success(client, test_user):
    """
    GIVEN an existing user in the DB
    WHEN GET /users/{email} is called with that user's email
    THEN it should return 202 and the correct user data
    """
    url = f"/users/{test_user.email}"
    res = client.get(url)
    assert res.status_code == status.HTTP_202_ACCEPTED

    data = res.json()
    assert data["email"] == test_user.email
    assert data["id"] == str(test_user.id)
    assert data.get("full_name") == test_user.full_name


def test_get_user_by_email_not_found(client):
    """
    GIVEN no user with the given email
    WHEN GET /users/{email} is called
    THEN it should return 404 with the proper detail message
    """
    random_email = "testinvalid@example.com"
    url = f"/users/{random_email}"
    res = client.get(url)
    assert res.status_code == status.HTTP_404_NOT_FOUND

    body = res.json()

    expected = f"user with email:{random_email} not found"
    assert body["detail"] == expected


def test_get_all_users_empty(client):
    """
    WHEN there are no non-admin users in the database
    THEN GET /users/ should return an empty list
    """
    res = client.get("/users/")
    assert res.status_code == status.HTTP_200_OK
    assert res.json() == []


def test_get_all_users_only_non_admin(client, db_session):
    """
    GIVEN one admin and two non-admin users in the DB
    WHEN GET /users/ is called
    THEN it should return only the two non-admin users
    """

    # create one admin user
    admin = models.User(
        id=uuid4(),
        email="admin@example.com",
        full_name="Admin User",
        is_admin=True,
        gender="other",
        dob=datetime.date(1990, 1, 1),
        password=hash_password("irrelevant"),
    )
    # create two regular users
    user1 = models.User(
        id=uuid4(),
        email="foo@example.com",
        full_name="Foo Bar",
        is_admin=False,
        gender="other",
        dob=datetime.date(2000, 2, 2),
        password=hash_password("irrelevant"),
    )
    user2 = models.User(
        id=uuid4(),
        email="baz@example.com",
        full_name="Baz Quux",
        is_admin=False,
        gender="other",
        dob=datetime.date(2001, 3, 3),
        password=hash_password("irrelevant"),
    )

    db_session.add_all([admin, user1, user2])
    db_session.commit()

    res = client.get("/users/")
    assert res.status_code == status.HTTP_200_OK

    data = res.json()
    # Should have exactly two entries, and neither is the admin
    emails = {u["email"] for u in data}
    assert emails == {"foo@example.com", "baz@example.com"}
    # ids should match what we inserted
    ids = {u["id"] for u in data}
    assert ids == {str(user1.id), str(user2.id)}
