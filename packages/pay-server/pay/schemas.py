from marshmallow import validate, validates, validates_schema, \
    ValidationError, post_dump
from datetime import datetime
from app import ma
from marshmallow import fields
from db import db
from sqlalchemy import select

# from auth import token_auth
from models import User

paginated_schema_cache = {}

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        ordered = True
        # exclude = ["email", "zcashaddress"]

    # id = ma.auto_field(dump_only=True)
    # id = ma.String(dump_only=True, data_key="uuid")
    id = fields.String(dump_only=True, attribute='uuid', data_key='id')
    uuid = ma.auto_field(dump_only=True)
    url = ma.String(dump_only=True)
    joined_on = ma.auto_field(dump_only=True)
    last_seen = ma.auto_field(dump_only=True)
    # username = ma.auto_field(
    #     required=True,validate=validate.Length(min=3, max=64)
    # )
    email = ma.String(
        # required=True,
        load_only=True,
        validate=[validate.Length(max=120), validate.Email()]
    )
    login_id = ma.String(
        # required=True,
        # load_only=True,
        dump_only=True,
        validate=[validate.Length(min=16), validate.Length(max=16)]
    )
    zcashaddress = ma.String(
        # required=True,
        load_only=True,
        validate=[validate.Length(max=255)]
    )

