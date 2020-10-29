import os

from flask import Flask, render_template, request, jsonify, flash, redirect, session, g
from flask import session, make_response

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


@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

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

    do_logout()
    flash("You have successfully logged out.", "success")
    return redirect('/')


@app.route("/", methods=["GET", "POST"])
def show_search_page():
    if request.method == 'POST':
        req = request.json
        res = requests.get(API_BASE_URL, params=req).json().get("results")
        s_res = [serialize_response(item) for item in res]
        return jsonify(s_res)
    else:
        return render_template("search.html", user=g.user)


@app.route("/fav", methods=["POST"])
def toggle_fav():
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
        # import pdb
        # pdb.set_trace()
        user.favors.remove(fav)
        db.session.commit()
        return jsonify({'message': 'successfully deleted'})


def serialize_response(res):
    artworkUrl = res.get(
        "artworkUrl100", "https://vcunited.club/wp-content/uploads/2020/01/No-image-available-2.jpg").replace("100x100", "300x300")
    # import pdb
    # pdb.set_trace()
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
        'country': res.get("country", "N/A")
    }
