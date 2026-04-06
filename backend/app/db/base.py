# Import all the models, so that Base has them before being
# imported by Alembic's env.py

from app.db.database import Base  # noqa
from app.models.user import User  # noqa
from app.models.ticket import Ticket  # noqa

# Now, in your alembic/env.py, you will import Base from THIS file:
# from app.db.base import Base
# target_metadata = Base.metadata
