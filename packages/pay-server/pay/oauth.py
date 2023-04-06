# from flask import current_app
from authlib.integrations.flask_client import OAuth
from authlib.integrations.flask_oauth2 import (
    ResourceProtector,
)
from authlib.oauth2.rfc6750 import BearerTokenValidator

# from authlib.integrations.requests_client import OAuth2Client
# from authlib.oauth2.rfc6749.errors import OAuth2Error

from models import OAuth2Token, User

def fetch_token(name, token):
    model = OAuth2Token

    print(123)
    token = model.find(
        # name=name,
        token=token
    )
    user = User.query.get(token.user_id)
    print(user)
    if not user:
        # FIXME: Handle case where user has been deleted
        return None
    return token.to_token(), user


oauth = OAuth(
    # fetch_token=fetch_token
)

class TokenValidator(BearerTokenValidator):
    def authenticate_token(self, token_string):
        token = OAuth2Token.query.filter_by(access_token=token_string).first()
        # user = User.query.filter_by(id=token.user_id).first()
        if token:
            return token
        return None


require_oauth = ResourceProtector()
require_oauth.register_token_validator(TokenValidator())
# def token_validator(access_token):
#     print(123123123)
#     token = OAuth2Token.query.filter_by(access_token=access_token).first()
#     return token is not None

def init_oauth(app):
    oauth.register(
        name='elemental_sso',
        client_id=app.config.get('CLIENT_IDS')['elemental-pay-api'],
        client_secret=app.config.get('CLIENT_SECRETS')['elemental-pay-api'],
        access_token_url=app.config.get('SSO_API') + '/oauth/token',
        authorize_url=app.config.get('SSO_API') + '/oauth/authorize',
        api_base_url=app.config.get('SSO_API') + '/api',
        # token_validator=token_validator,
        # token_placement='header',
    )


# oauth2_client = OAuth2Client(
#     client_id=current_app.config.get('CLIENT_IDS')['elemental-pay-api'],
#     client_secret=current_app.config.get('CLIENT_SECRETS')['elemental-pay-api'],
#     access_token_url=current_app.config.get('SSO_API') + '/oauth/token',
#     authorize_url=current_app.config.get('SSO_API') + '/oauth/authorize',
#     api_base_url=current_app.config.get('SSO_API') + '/api',
# )

