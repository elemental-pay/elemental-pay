import time
import os
import json
from db import db;
from authlib.integrations.sqla_oauth2 import (
    OAuth2TokenMixin,
)

class OAuth2Token(db.Model, OAuth2TokenMixin):
    __tablename__ = 'oauth2_tokens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    user = db.relationship('User')
    # user: db.Mapped['User'] = db.relationship(back_populates='tokens')

    def expires_at(self):
        print(1234)
        return self.issued_at + 999999999999

    def is_refresh_token_active(self):
        print(123)
        if self.revoked:
            return False
        expires_at = self.issued_at + self.expires_in * 2
        return expires_at >= time.time()

    def to_token(self):
        return dict(
            access_token=self.access_token,
            token_type=self.token_type,
            refresh_token=self.refresh_token,
            expires_at=self.expires_at,
        )
