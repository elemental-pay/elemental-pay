from datetime import datetime
from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Role(Enum):
    OWNER = "owner"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class Organisation(db.Model):
    __tablename__ = "organisation"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    registration_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # one-to-many relationship with stores
    stores = relationship("Store", back_populates="organisation")

class Store(db.Model):
    __tablename__ = "store"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    registration_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    address = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))

    # one-to-many relationship with employees
    employees = relationship("Employee", back_populates="store")

    # many-to-one relationship with organisation
    organisation_id = db.Column(db.Integer, db.ForeignKey("organisation.id"), nullable=False)
    organisation = relationship("Organisation", back_populates="stores")

class Employee(db.Model):
    __tablename__ = "employee"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    role = db.Column(db.Enum(Role), nullable=False, default=Role.EMPLOYEE)

    # many-to-one relationship with store
    store_id = db.Column(db.Integer, db.ForeignKey("store.id"), nullable=False)
    store = relationship("Store", back_populates="employees")