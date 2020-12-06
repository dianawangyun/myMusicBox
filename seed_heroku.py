from app import app
from models import db, User, Song, Favors

# create tables
db.drop_all()
db.create_all()

# setup a test user
u1 = User.signup(username="test", password="123456", email="test@test.com")
db.session.add(u1)
db.session.commit()
