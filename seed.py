from app import app
from models import db, User, Song, Favors
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# config the user name and password here before running the seed
USER = 'postgres'
PASSWORD = 'wy'

# create database
con = psycopg2.connect(f"user={USER} password='{PASSWORD}'")
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

cursor = con.cursor()

name_Database = "music-box"

sqlCreateDatabase = f"create database \"{name_Database}\";"

cursor.execute(sqlCreateDatabase)

# create tables
db.drop_all()
db.create_all()

# setup a test user
u1 = User.signup(username="test", password="123456", email="test@test.com")
db.session.add(u1)
db.session.commit()
