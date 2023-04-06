# from . import db
# from .models import Contact, ContactGroup, Gender

from flask import Flask, current_app
from flask.cli import with_appcontext
from sqlalchemy import select, text, create_engine, MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from apifairy import APIFairy
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
import click
import json
import sys
import logging

import os

from db import db
from models import User
from oauth import oauth, init_oauth

# load_dotenv('.env') # FIXME: For Docker, maybe better to use env_file

# FIXME: This is for Docker, maybe there's a better alternative
os.environ['AUTHLIB_INSECURE_TRANSPORT'] = '1'

# log = logging.getLogger('authlib')
# log.addHandler(logging.StreamHandler(sys.stdout))
# log.setLevel(logging.DEBUG)


# app = Flask(__name__)
# db = SQLAlchemy()
migrate = Migrate()
apifairy = APIFairy()
ma = Marshmallow()
cors = CORS()
# oauth = OAuth()


# @click.command()
# @with_appcontext
# def populate_clients():
#     OAuth2Client.insert_clients()

#     return


@click.command()
@with_appcontext
def reset_db():
    db.drop_all()

def create_app(config_name = None):
    app = Flask(__name__)
    app.config.from_object(config_name or os.environ['APP_SETTINGS'])
    db.init_app(app)
    migrate.init_app(app, db)
    apifairy.init_app(app)
    ma.init_app(app)
    init_oauth(app)

    # oauth.register(
    #     name='elemental_sso',
    #     client_id=app.config.get('CLIENT_IDS')['elemental-pay-api'],
    #     client_secret=app.config.get('CLIENT_SECRETS')['elemental-pay-api'],
    #     access_token_url=app.config.get('SSO_API') + '/oauth/token',
    #     authorize_url=app.config.get('SSO_API') + '/oauth/authorize',
    #     api_base_url=app.config.get('SSO_API') + '/api',
    # )

    oauth.init_app(app)
    app.oauth = oauth
    # config_oauth(app)
    if app.config['USE_CORS']:
        cors.init_app(app)

    try:
        with app.app_context():
            # db.init_app(app)
            db.session.execute(text('SELECT 1'))

            if not db.metadata.tables:
                db.create_all()
            db.session.commit()

    except Exception as e:
        print('Error connecting to database:', str(e))
        exit(1)

    # print(app.extensions)
    # print(app.oauth)

    # print(oauth.fetch_token())

    # from api.errors import errors
    # app.register_blueprint(errors)

    from api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='')


    # from routes.oauth2 import bp as oauth2_bp
    # app.register_blueprint(oauth2_bp, url_prefix='')

    # from routes.home import bp as home_bp
    # app.register_blueprint(home_bp, url_prefix='')

    # app.cli.add_command(populate_clients, 'populate-clients')
    
    return app

# def setup_app(app):
#     # Create tables if they do not exist already
#     @app.before_first_request
#     def create_tables():
#         db.create_all()

#     # db.init_app(app)
#     app.register_blueprint(routes_bp, url_prefix='')

# from models import user

