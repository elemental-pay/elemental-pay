from flask import request, jsonify
from authlib.integrations.flask_oauth2 import current_token, ResourceProtector

from api import bp as api
from db import db
from models import OAuth2Token

from oauth import oauth

# rp = ResourceProtector()
from oauth import require_oauth

# @oauth.elemental_sso.token_validator
# def my_sso_server_token_validator(token):
#     # Check if the access token is valid
#     # session = Session()
#     oauth2_token = db.session.query(OAuth2Token).filter_by(access_token=token).first()
#     if oauth2_token:
#         # If the token is valid, return the associated user
#         return oauth2_token.user
#     else:
#         # If the token is invalid, return None
#         return None


@api.route('/user_id')
@require_oauth('profile')
def user_id():
    # current token instance of the OAuth Token model
    # token = require_oauth.
    token = current_token

    user = token.user

    # print(rp.parse_request_authorization(request))
    # print(token)
    return jsonify({
        'id': user.uuid,
        'username': user.username
    })
