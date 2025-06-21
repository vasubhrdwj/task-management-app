"""alter audit_logs.task_id fk to SET NULL

Revision ID: 52a7c285d8eb
Revises: ca2271051017
Create Date: 2025-06-21 18:59:51.767833

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "52a7c285d8eb"
down_revision: Union[str, None] = "ca2271051017"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint(
        "audit_logs_task_id_fkey",
        "audit_logs",
        type_="foreignkey",
    )

    # THEN alter the column to nullable
    op.alter_column(
        "audit_logs",
        "task_id",
        existing_type=sa.Integer(),  # or sa.UUID if needed
        nullable=True,
    )

    # THEN recreate the FK with ON DELETE SET NULL
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
    # make the column NOT NULL again
    op.alter_column(
        "audit_logs",
        "task_id",
        existing_type=sa.Integer(),  # or sa.UUID()
        nullable=False,
    )
    # recreate the original CASCADE FK
    op.create_foreign_key(
        "audit_logs_task_id_fkey",
        "audit_logs",
        "tasks",
        ["task_id"],
        ["id"],
        ondelete="CASCADE",
    )
