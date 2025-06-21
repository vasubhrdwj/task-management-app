"""fix audit_logs.task_id SET NULL

Revision ID: 888e7085eb42
Revises: 52a7c285d8eb
Create Date: 2025-06-21 19:13:23.165891

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "888e7085eb42"
down_revision: Union[str, None] = "52a7c285d8eb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "audit_logs",
        "task_id",
        existing_type=sa.Integer(),  # or sa.UUID if needed
        nullable=True,
    )

    op.create_foreign_key(
        "audit_logs_task_id_fkey",
        "audit_logs",
        "tasks",
        ["task_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("audit_logs_task_id_fkey", "audit_logs", type_="foreignkey")
    op.alter_column(
        "audit_logs",
        "task_id",
        existing_type=sa.Integer(),
        nullable=False,
    )
    op.create_foreign_key(
        "audit_logs_task_id_fkey",
        "audit_logs",
        "tasks",
        ["task_id"],
        ["id"],
        ondelete="CASCADE",
    )
