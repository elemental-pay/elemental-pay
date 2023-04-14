from datetime import datetime, timedelta
from db import db

class Updateable:
    def update(self, data):
        for attr, value in data.items():
            setattr(self, attr, value)

roles = db.Table(
    'role_users',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'))
)

tokens = db.Table(
    'token_users',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('oauth2_token_id', db.Integer, db.ForeignKey('oauth2_tokens.id'))
)


class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    def __init__(self, name):
        self.name = name
    def __repr__(self):
        return '<Role {}>'.format(self.name)

class User(Updateable, db.Model):
    __tablename__ = 'users'

    # __tablename__ = "flasksqlalchemy-tutorial-users"
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(64), index=True, unique=True, nullable=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=True)
    joined_on = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)
    bio = db.Column(db.Text, nullable=True)
    is_admin = db.Column(db.Boolean, nullable=True)
    roles = db.relationship(
        'Role',
        secondary=roles,
        backref=db.backref('users', lazy='dynamic')
    )

    tokens = db.relationship(
        'OAuth2Token',
        secondary=tokens,
        backref=db.backref('users', lazy='dynamic')
        # back_populates='users'
    )
