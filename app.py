import os

from flask import Flask, render_template, request, jsonify, flash, redirect, session, g
from flask import session, make_response

from sqlalchemy import func, desc
from sqlalchemy.exc import IntegrityError
import requests

from forms import UserAddForm, LoginForm, EditProfileForm
from models import db, connect_db, User, Song, Favors

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgres:///music-box'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
API_BASE_URL = "https://itunes.apple.com/search"

connect_db(app)

"""only for init database"""
# db.drop_all()
# db.create_all()


@app.before_request
def add_user_to_g():
    """If logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None


def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.

    Create new user and add to DB. Redirect to home page.

    If form not valid, present form.

    If the there already is a user with that username: flash message
    and re-present form.
    """

    form = UserAddForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('signup.html', form=form)

        do_login(user)

        return redirect("/")

    else:
        return render_template('signup.html', form=form)


@app.route("/")
def show_homepage():
    """show homepage"""

    return render_template("home.html")


@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    if g.user:
        flash(
            f"Hello, {g.user.username}. You have already logged in!", "info")
        return redirect("/")

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            flash(f"Welcome back, {user.username}!", "success")
            return redirect("/")

        flash("Invalid credentials.", 'danger')

    return render_template('login.html', form=form)


@app.route("/logout")
def logout():
    """Handle logout of user."""

    if g.user:
        do_logout()
        flash("You have successfully logged out.", "success")
    return redirect('/')


@app.route("/search", methods=["GET", "POST"])
def search_music():
    """Render search page with get request and return JSON result back with post request."""

    if request.method == 'POST':
        req = request.json
        res = requests.get(API_BASE_URL, params=req).json().get("results")
        s_res = [serialize_response(item) for item in res]
        return jsonify(s_res)
    else:
        return render_template("search.html", user=g.user)


@app.route("/update-fav", methods=["POST"])
def update_fav():
    """Handle add/remove favorite."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(g.user.id)
    req = request.json
    track_id = req.get("trackId")
    favs_id = [fav.song_id for fav in g.user.favors]

    if track_id not in favs_id:
        song = Song(**req)
        if not Song.query.filter_by(trackId=song.trackId).first():
            db.session.add(song)
            db.session.commit()
        fav = Favors(user_id=g.user.id, song_id=song.trackId)
        db.session.add(fav)
        db.session.commit()
        return jsonify({'message': 'successfully added'})
    else:
        fav = Favors.query.filter_by(song_id=track_id, user_id=user.id).first()
        user.favors.remove(fav)
        db.session.commit()
        return jsonify({'message': 'successfully deleted'})


@app.route("/favoriteslist")
def get_my_favoriteslist():
    """Return user favorite list from database."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    user = User.query.get_or_404(g.user.id)
    favs = user.songs
    s_favs = [serialize_database(item) for item in favs]
    return jsonify(s_favs)


@app.route("/favorites")
def get_my_favorites():
    """Render user favorite list page."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    else:
        return render_template("favorite.html")


@app.route("/taste")
def get_my_taste():
    """Render user taste page."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    else:
        return render_template("taste.html")


@app.route("/tastedata")
def get_my_taste_data():
    """Return user taste data in json format."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")
    user = User.query.get_or_404(g.user.id)

    taste_res = db.session.query(Song.primaryGenreName, func.count(Favors.song_id).label("frequency")).join(
        Favors, Song.trackId == Favors.song_id).filter(Favors.user_id == user.id).group_by(Song.primaryGenreName).order_by(desc("frequency")).all()
    res = []
    for ele in taste_res:
        resp = {}
        resp["value"] = ele.frequency
        resp["name"] = ele.primaryGenreName
        res.append(resp)
    return jsonify(res)


@ app.errorhandler(404)
def page_not_found(e):
    """Show 404 NOT FOUND page."""

    return render_template('404.html'), 404


def serialize_response(res):
    """Return data get from API with desired format."""

    if g.user:
        favs_id = [fav.song_id for fav in g.user.favors]
        isFavor = res["trackId"] in favs_id
    else:
        isFavor = None

    artworkUrl = res.get(
        "artworkUrl100", "https://vcunited.club/wp-content/uploads/2020/01/No-image-available-2.jpg").replace("100x100", "300x300")

    return {
        'kind': res.get("kind"),
        'primaryGenreName': res.get("primaryGenreName", "N/A"),
        'collectionId': res.get("collectionId", "N/A"),
        'collectionName': res.get("collectionName", "N/A"),
        'trackCount': res.get("trackCount", "N/A"),
        'trackViewUrl': res.get("trackViewUrl", "N/A"),
        'trackId': res.get("trackId", "N/A"),
        'trackName': res.get("trackName", "N/A"),
        'trackNumber': res.get("trackNumber", "N/A"),
        'artistId': res.get("artistId", "N/A"),
        'artistName': res.get("artistName", "N/A"),
        'artistViewUrl': res.get("artistViewUrl", "N/A"),
        'previewUrl': res.get("previewUrl", "N/A"),
        'artworkUrl': artworkUrl,
        'releaseDate': res.get("releaseDate", "N/A"),
        'collectionPrice': res.get("collectionPrice", "N/A"),
        'trackPrice': res.get("trackPrice", "N/A"),
        'currency': res.get("currency", "N/A"),
        'country': res.get("country", "N/A"),
        'isFavor': isFavor
    }


def serialize_database(data):
    """Return data get from database with desired format."""

    return {
        'kind': data.kind,
        'primaryGenreName': data.primaryGenreName,
        'collectionId': data.collectionId,
        'collectionName': data.collectionName,
        'trackCount': data.trackCount,
        'trackViewUrl': data.trackViewUrl,
        'trackId': data.trackId,
        'trackName': data.trackName,
        'trackNumber': data.trackNumber,
        'artistId': data.artistId,
        'artistName': data.artistName,
        'artistViewUrl': data.artistViewUrl,
        'previewUrl': data.previewUrl,
        'artworkUrl': data.artworkUrl,
        'releaseDate': data.releaseDate,
        'collectionPrice': data.collectionPrice,
        'trackPrice': data.trackPrice,
        'currency': data.currency,
        'country': data.country,
        'isFavor': True
    }
