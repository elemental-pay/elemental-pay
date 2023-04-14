from flask import Blueprint

bp = Blueprint('api', __name__)

# from .users import bp as users_bp
# bp.register_blueprint(users_bp)

# from api import users, errors, tokens
from .users import *
# from .auth import *
# from .tokens import *
# from .errors import *
# from .schemas import *
