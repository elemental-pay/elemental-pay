from flask import Blueprint, redirect, request, abort, jsonify, current_app, url_for
from authlib.integrations.flask_oauth2 import current_token
# from api.schemas import UserSchema, LoginSchema, SignupSchema
from apifairy import authenticate, body, response
from authlib.integrations.flask_oauth2 import current_token
from authlib.integrations.requests_client import OAuth2Session
from requests.auth import HTTPBasicAuth
import copy

from db import db
from models import User, OAuth2Token

# from api import bp as api
# from oauth import require_oauth, AuthorizationCodeGrant
# from models import User, OAuth2Client
# from api.errors import http_error
# from db import db
# from oauth2 import authorization

import re
import base64

# login_id_pattern = "^[A-Z1-9]{16}$"

auth_bp = Blueprint('auth', __name__)
auth = auth_bp


@auth.route('/auth/authorize')
def authorize():
    oauth2_client = current_app.oauth.elemental_sso

    authorization_url, state = oauth2_client.create_authorization_url(
        # authorization_endpoint='https://oauth2.provider.com/authorize',
        redirect_uri=url_for('/auth/callback', _external=True),
        scope='profile email',
    )
    # Store the state in the session for validation later
    # session['oauth2_state'] = state
    return redirect(authorization_url)

@auth.route('/auth/callback')
def callback():
    code = request.args.get('code')
    sso_client = current_app.oauth.elemental_sso

    client_id = current_app.config.get('CLIENT_ID_ELEMENTAL_PAY_API')
    client_secret = current_app.config.get('CLIENT_SECRET_ELEMENTAL_PAY_API')

    client = OAuth2Session(
        client_id,
        client_secret,
        token_endpoint=current_app.config.get('SSO_API') + '/oauth/token',
        token_endpoint_auth_method='client_secret',
        redirect_uri='https://elemental-pay.local/auth/callback'
        # state=state
    )
    auth = HTTPBasicAuth(client_id, client_secret)

    # token = sso_client.authorize_access_token()
    print(current_app.config.get('SSO_API') + '/oauth/token')
    token = client.fetch_token(
        # token_endpoint='https://oauth2.provider.com/token',
        authorization_response=request.url,
        grant_type='authorization_code',
        auth=auth,
        url=current_app.config.get('SSO_API') + '/oauth/token'
        # token_endpoint_auth_method='client_secret'
        # code=code
    )
    # token = client.fetch_token(authorization_response=request.url, code=code)
    print(token['access_token'])
    # user_info = sso_client.get('me').json()
    # client.token = 
    access_token = token.get('access_token')
    user_info = client.get(
        current_app.config.get('SSO_API') + '/api/me',
        headers={'Authorization': f'Bearer {access_token}'}
    ).json()

    username = user_info['username']
    uuid = user_info['id']
    # token = sso_client.fetch_token(authorization_response=request.url, code=code)
    # user_info = client.get('me').json()
    # print({'token': token, 'user_info': user_info})
    # # email = user_info['email']
    user = User.query.filter_by(username=username).first()
    if user is None:
        user = User(
            username=username,
            uuid=uuid
        )
        db.session.add(user)
        db.session.commit()
    oauth_token = OAuth2Token(
        user_id=user.id,
        client_id=client_id,
        access_token=token['access_token'],
        refresh_token=token.get('refresh_token'),
        token_type=token['token_type'],
        expires_at=token['expires_at'],
    )
    db.session.add(oauth_token)
    user.tokens.append(oauth_token)
    db.session.add(user)
    db.session.commit()
    # session['user_id'] = user.id
    # return redirect(url_for('index'))

    return {
        'access_token': token['access_token'],
        'refresh_token': token.get('refresh_token'),
        'token_type': token['token_type'],
        'expires_at': token['expires_at']
    }
