from enum import Enum as PyEnum


class Priority(PyEnum):
    low = "low"
    medium = "medium"
    high = "high"


PRIORITY_VALUES = [e.value for e in Priority]


class Action(PyEnum):
    INSERT_TASK = "INSERT_TASK"
    DELETE_TASK = "DELETE_TASK"
    UPDATE_TASK = "UPDATE_TASK"