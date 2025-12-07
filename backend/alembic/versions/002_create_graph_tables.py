"""create graph tables

Revision ID: 002_create_graph_tables
Revises: 001_create_user_table
Create Date: 2025-12-07 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision: str = '002_create_graph_tables'
down_revision: Union[str, None] = '001_create_user_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ensure vector extension exists
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        'meme',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('embedding', Vector(384), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_meme_id'), 'meme', ['id'], unique=False)

    op.create_table(
        'edge',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_id', sa.Integer(), nullable=False),
        sa.Column('target_id', sa.Integer(), nullable=False),
        sa.Column('weight', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['source_id'], ['meme.id'], ),
        sa.ForeignKeyConstraint(['target_id'], ['meme.id'], )
    )
    op.create_index(op.f('ix_edge_id'), 'edge', ['id'], unique=False)
    
    # Create vector index for faster search (IVFFlat)
    # Lists = 100 is a starter value, can be tuned based on dataset size
    # Note: IVFFlat requires some data to be built effectively, but we can create it empty.
    # op.execute("CREATE INDEX ON meme USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);")


def downgrade() -> None:
    op.drop_index(op.f('ix_edge_id'), table_name='edge')
    op.drop_table('edge')
    op.drop_index(op.f('ix_meme_id'), table_name='meme')
    op.drop_table('meme')
