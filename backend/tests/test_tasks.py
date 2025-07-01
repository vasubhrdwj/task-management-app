# backend/tests/test_tasks.py

import datetime
import pytest
from uuid import uuid4

from fastapi import status
from sqlalchemy import case

from backend import models
from backend.utils import hash_password
from backend.constants import Action

from typing import Any, Dict
from fastapi import status
from backend.models import Priority, Tasks

ENDPOINT = "/tasks/"


@pytest.fixture()
def task_factory(db_session):
    """
    Returns a callable you can use to create one or many tasks in the DB.
    """

    def _make(owner_email, **kwargs):
        defaults = {
            "user_email": owner_email,
            "title": "Sample",
            "description": "Desc",
            "priority": Priority.medium.value,
            "deadline": datetime.date(2025, 12, 31),
            "is_complete": False,
        }
        data = {**defaults, **kwargs}
        task = models.Tasks(**data)
        db_session.add(task)
        db_session.commit()
        return task

    return _make


def make_payload(
    title: str = "T1",
    description: str = "Desc",
    priority: str = Priority.high.value,
    deadline: str = "2025-12-31",
) -> Dict[str, Any]:
    return {
        "title": title,
        "description": description,
        "priority": priority,
        "deadline": deadline,
    }


def get_hdrs_for(user, token_for):
    token = token_for(user)
    return {"Authorization": f"Bearer {token}"}


def test_regular_user_sees_only_their_tasks(
    client, db_session, test_user, admin_user, task_factory, token_for
):
    # create tasks for both users
    t1 = task_factory(test_user.email, title="U1-T1")
    t2 = task_factory(test_user.email, title="U1-T2")
    task_factory(admin_user.email, title="ADMIN-T")

    # call as test_user
    res = client.get(ENDPOINT, headers=get_hdrs_for(test_user, token_for))
    assert res.status_code == status.HTTP_202_ACCEPTED

    titles = {t["title"] for t in res.json()}
    assert titles == {"U1-T1", "U1-T2"}


def test_admin_can_filter_by_user_mail(
    client, db_session, test_user, admin_user, task_factory, token_for
):
    # seed some
    t1 = task_factory(test_user.email, priority=Priority.high.value)
    t2 = task_factory(test_user.email, priority=Priority.low.value)
    t3 = task_factory(admin_user.email)

    # admin requests only test_user’s
    url = ENDPOINT + f"?user_mail={test_user.email}"
    res = client.get(url, headers=get_hdrs_for(admin_user, token_for))
    assert res.status_code == status.HTTP_202_ACCEPTED

    emails = {t["user_email"] for t in res.json()}
    assert emails == {test_user.email}


@pytest.mark.parametrize(
    "sort_by,desc,expected_order",
    [
        (
            "priority",
            False,
            [Priority.high.value, Priority.medium.value, Priority.low.value],
        ),
        (
            "priority",
            True,
            [Priority.low.value, Priority.medium.value, Priority.high.value],
        ),
        ("due_date", False, None),  # natural ascending by deadline
        ("due_date", True, None),
        ("status", False, [False, True]),
        ("status", True, [True, False]),
    ],
)
def test_sorting_variants(
    client,
    db_session,
    test_user,
    task_factory,
    token_for,
    sort_by,
    desc,
    expected_order,
):
    # clear, then seed with varied values
    # priority test: high, medium, low
    # due_date test: deadlines in random order
    # status test: complete/incomplete
    # We’ll create 3 tasks for composite tests, or 2 for status.
    params = {"sort_by": sort_by, "sort_desc": str(desc).lower()}

    # seed
    if sort_by == "priority":
        t_high = task_factory(test_user.email, priority=Priority.high.value)
        t_med = task_factory(test_user.email, priority=Priority.medium.value)
        t_low = task_factory(test_user.email, priority=Priority.low.value)
        expected = expected_order
        resp_tasks = [t_high, t_med, t_low]

    elif sort_by == "due_date":
        t1 = task_factory(test_user.email, deadline=datetime.date(2025, 1, 1))
        t2 = task_factory(test_user.email, deadline=datetime.date(2025, 6, 1))
        t3 = task_factory(test_user.email, deadline=datetime.date(2025, 12, 1))
        resp_tasks = [t1, t2, t3] if not desc else [t3, t2, t1]

    elif sort_by == "status":
        t_incp = task_factory(test_user.email, is_complete=False)
        t_cmpl = task_factory(test_user.email, is_complete=True)
        resp_tasks = [t_incp, t_cmpl] if not desc else [t_cmpl, t_incp]

    # build query string
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    res = client.get(ENDPOINT + "?" + qs, headers=get_hdrs_for(test_user, token_for))
    assert res.status_code == status.HTTP_202_ACCEPTED

    data = res.json()
    # if expected_order provided, map values out
    if expected_order is not None:
        if sort_by == "priority":
            got = [t["priority"] for t in data]
        elif sort_by == "status":
            got = [t["is_complete"] for t in data]
        else:
            # for due_date we didn’t set expected_order, so we’ll hit the else below
            got = None

        if got is not None:
            assert got == expected_order
            return

    # otherwise (due_date or fallback) compare by the IDs we seeded
    ids = [t.id for t in resp_tasks]
    got_ids = [t["id"] for t in data]
    assert got_ids == ids


def test_invalid_sort_by_returns_405(client, test_user, token_for):
    res = client.get(
        ENDPOINT + "?sort_by=foo", headers=get_hdrs_for(test_user, token_for)
    )
    assert res.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    assert res.json()["detail"] == "Not a valid value"


@pytest.fixture
def other_user(db_session):
    """Create another non-admin user to assign tasks to."""
    u = models.User(
        id=uuid4(),
        email="other@example.com",
        full_name="Other User",
        is_admin=False,
        gender="other",
        dob=datetime.date(1992, 2, 2),
        password="irrelevant",
    )
    db_session.add(u)
    db_session.commit()
    return u


def auth_headers(user, token_for):
    return {"Authorization": f"Bearer {token_for(user)}"}


def test_non_admin_cannot_create(client, test_user, token_for):
    # 1) make the flat dict of task fields
    flat = make_payload()

    # 2) build the wrapper shape the endpoint expects
    payload = {
        "task": flat,
        "email_ids": [test_user.email],
    }

    res = client.post(
        "/tasks/create/",
        json=payload,
        headers=auth_headers(test_user, token_for),
    )

    # now validation will pass and you'll hit your 403
    assert res.status_code == status.HTTP_403_FORBIDDEN
    assert res.json()["detail"] == "Not required permissions"


def test_missing_email_ids_validation_error(client, admin_user, token_for):
    # no email_ids query param
    res = client.post(
        "/tasks/create/",
        json=make_payload(),
        headers=auth_headers(admin_user, token_for),
    )
    # FastAPI will return 422 Unprocessable Entity for missing required list
    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.parametrize(
    "targets",
    [
        ["test@example.com"],
        ["test@example.com", "other@example.com"],
    ],
)
def test_admin_creates_tasks_for_users(
    client, db_session, admin_user, test_user, other_user, token_for, targets
):
    """
    GIVEN an admin and some existing users
    WHEN POST /tasks/create/?email_ids=... is called
    THEN it creates one Task per email_id, returns them, and writes AuditLogs
    """

    flat = make_payload(
        title="Batch Task",
        description="Batch Desc",
        priority=Priority.medium.value,
    )

    payload = {"task": flat, "email_ids": targets}

    res = client.post(
        f"/tasks/create/",
        json=payload,
        headers=auth_headers(admin_user, token_for),
    )
    assert res.status_code == status.HTTP_201_CREATED

    data = res.json()
    assert isinstance(data, list)
    assert len(data) == len(targets)

    returned_emails = {t["user_email"] for t in data}
    assert returned_emails == set(targets)
    for t in data:
        assert t["title"] == flat["title"]
        assert t["description"] == flat["description"]
        assert t["priority"] == flat["priority"]
        assert t["deadline"].startswith(str(flat["deadline"]))

    logs = (
        db_session.query(models.AuditLog)
        .filter(models.AuditLog.action == Action.CREATE_TASK)
        .all()
    )
    assert len(logs) == len(targets)

    task_ids = {int(t["id"]) for t in data}
    for log in logs:
        assert log.admin_user_id == admin_user.id
        assert log.task_id in task_ids

        targets_in_log = [t.user_id for t in log.targets]
        assert len(targets_in_log) == 1

        target_email = (
            db_session.query(models.User.email)
            .filter(models.User.id == targets_in_log[0])
            .scalar()
        )
        assert target_email in targets


def test_get_task_success(client, user_factory, task_factory, token_for):
    # Arrange
    user = user_factory(email="owner@example.com")
    task = task_factory(user.email)
    headers = {"Authorization": f"Bearer {token_for(user)}"}

    # Act
    res = client.get(f"/tasks/{task.id}", headers=headers)

    # Assert
    assert res.status_code == status.HTTP_202_ACCEPTED
    data = res.json()
    assert data["id"] == task.id
    assert data["user_email"] == user.email


def test_get_task_not_found(client, user_factory, token_for):
    # Arrange
    user = user_factory()
    headers = {"Authorization": f"Bearer {token_for(user)}"}

    # Act
    res = client.get("/tasks/9999", headers=headers)

    # Assert
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_update_task_success_owner(client, user_factory, task_factory, token_for):
    # Arrange
    user = user_factory(email="owner2@example.com")
    task = task_factory(user.email, title="Old")
    headers = {"Authorization": f"Bearer {token_for(user)}"}
    payload = {"title": "New Title"}

    # Act
    res = client.patch(f"/tasks/update/{task.id}", json=payload, headers=headers)

    # Assert
    assert res.status_code == status.HTTP_202_ACCEPTED
    data = res.json()
    assert data["title"] == "New Title"


def test_update_task_forbidden_non_owner(client, user_factory, task_factory, token_for):
    # Arrange
    owner = user_factory(email="owner3@example.com")
    other = user_factory(email="other@example.com")
    task = task_factory(owner.email)
    headers = {"Authorization": f"Bearer {token_for(other)}"}
    payload = {"description": "Hacked"}

    # Act
    res = client.patch(f"/tasks/update/{task.id}", json=payload, headers=headers)

    # Assert
    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_update_task_not_found(client, user_factory, token_for):
    # Arrange
    user = user_factory()
    headers = {"Authorization": f"Bearer {token_for(user)}"}
    payload = {"priority": Priority.low.value}

    # Act
    res = client.patch("/tasks/update/9999", json=payload, headers=headers)

    # Assert
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_delete_task_success_owner(
    client, user_factory, task_factory, db_session, token_for
):
    # Arrange
    user = user_factory(email="owner4@example.com")
    task = task_factory(user.email)
    task_id = task.id  # capture ID before deletion to avoid session-expiry issues
    headers = {"Authorization": f"Bearer {token_for(user)}"}

    # Act
    res = client.delete(f"/tasks/delete/{task_id}", headers=headers)

    # Assert
    assert res.status_code == status.HTTP_204_NO_CONTENT
    assert db_session.query(Tasks).filter_by(id=task_id).first() is None


def test_delete_task_forbidden_non_owner(client, user_factory, task_factory, token_for):
    # Arrange
    owner = user_factory(email="owner5@example.com")
    other = user_factory(email="other2@example.com")
    task = task_factory(owner.email)
    headers = {"Authorization": f"Bearer {token_for(other)}"}

    # Act
    res = client.delete(f"/tasks/delete/{task.id}", headers=headers)

    # Assert
    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_delete_task_not_found(client, user_factory, token_for):
    # Arrange
    user = user_factory()
    headers = {"Authorization": f"Bearer {token_for(user)}"}

    # Act
    res = client.delete("/tasks/delete/9999", headers=headers)

    # Assert
    assert res.status_code == status.HTTP_404_NOT_FOUND
