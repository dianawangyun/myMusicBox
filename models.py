from datetime import datetime

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()


class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    songs = db.relationship('Song', secondary="user_song")
    favors = db.relationship('Favors', backref='users',
                             cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User #{self.id}: {self.username}>"

    @classmethod
    def signup(cls, username, email, password):
        """Sign up user."""

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(username=username, password=hashed_pwd, email=email)

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`. Return user if username and password matches, and False if not. """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False


class Song(db.Model):
    """An individual song."""

    __tablename__ = 'songs'

    # id refers trackId for unique
    kind = db.Column(db.String(15), default="song")
    primaryGenreName = db.Column(db.String(30), nullable=False)
    collectionId = db.Column(db.Integer, nullable=False)
    collectionName = db.Column(db.String)
    trackCount = db.Column(db.Integer)
    trackViewUrl = db.Column(db.String)
    trackId = db.Column(db.Integer, primary_key=True)
    trackName = db.Column(db.String, nullable=False)
    trackNumber = db.Column(db.Integer)
    artistId = db.Column(db.Integer, nullable=False)
    artistName = db.Column(db.String, nullable=False)
    artistViewUrl = db.Column(db.String)
    previewUrl = db.Column(db.String)
    artworkUrl = db.Column(db.String)
    releaseDate = db.Column(db.String)
    collectionPrice = db.Column(db.Float)
    trackPrice = db.Column(db.Float)
    currency = db.Column(db.String(10))
    country = db.Column(db.String(10))
    users = db.relationship('User', secondary="user_song")
    favors = db.relationship('Favors', backref='songs',
                             cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Song #{self.trackNumber}: {self.trackName}>"


class Favors(db.Model):
    """Mapping user favors to songs."""

    __tablename__ = 'user_song'

    # id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(
        'songs.trackId'), primary_key=True)
    remark = db.Column(db.String(150))
    favorite_date = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow())


def connect_db(app):
    """Connect this database to app."""

    db.app = app
    db.init_app(app)
