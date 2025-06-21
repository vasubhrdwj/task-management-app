"""rename enum value INSERT_TASK → CREATE_TASK

Revision ID: ca2271051017
Revises: 91c0443f7940
Create Date: 2025-06-21 17:19:23.832703

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "ca2271051017"
down_revision: Union[str, None] = "91c0443f7940"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE action_enum RENAME VALUE 'INSERT_TASK' TO 'CREATE_TASK';")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TYPE action_enum RENAME VALUE 'CREATE_TASK' TO 'INSERT_TASK';")
