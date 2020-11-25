from app import app, CURR_USER_KEY
import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, connect_db, User, Song, Favors
from flask import Flask, session, g

# need to build a database through postgresql named "musicbox_test" first
os.environ['DATABASE_URL'] = "postgresql:///musicbox_test"

app.config['SQLALCHEMY_ECHO'] = False
app.config['WTF_CSRF_ENABLED'] = False

app.config['TESTING'] = True

db.create_all()

USER_DATA1 = {
    "username": "test1",
    "password": "123456",
    "email": 'test1@test.com',
}

USER_DATA2 = {
    "username": "test2",
    "password": "123456",
    "confirm": "123456",
    "email": 'test2@test.com',
}


class UserTestCase(TestCase):
    """test user functions"""

    def setUp(self):
        """Make demo data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.user1 = User.signup(**USER_DATA1)
        self.user1.id = 100
        db.session.add(self.user1)
        db.session.commit()

    def tearDown(self):
        """Clean up fouled transactions."""

        resp = super().tearDown()
        db.session.rollback()
        return resp

    def test_show_signup_page(self):
        "test render signup page"

        with self.client as c:
            resp = c.get('/signup')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn(
                '<h1 class="text-center my-5">Signup and Enjoy the Music!</h1>', html)

    def test_signup(self):
        "test signup a new user"

        with self.client as c:
            resp = c.post(
                '/signup', data=USER_DATA2, follow_redirects=True)
            user2 = User.query.filter_by(username="test2").first()
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn('Thanks for signing up', html)
            self.assertEqual(user2.email, "test2@test.com")
            self.assertNotEqual(user2.password, "123456")
            self.assertTrue(user2.password.startswith("$2b$"))

    def test_signup_user_exist(self):
        "test signup an existing user"

        with self.client as c:
            resp = c.post('/signup', data={
                "username": "test1",
                "password": "123456",
                "confirm": "123456",
                "email": 'test1@test.com',
            }, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn('Username already taken', html)

    def test_user_login(self):
        "test existing user login"

        with self.client as c:
            resp = c.post('/login', data={
                "username": "test1",
                "password": "123456",
            }, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Welcome to My Music Box", html)

            user = User.query.filter_by(username="test1").first()
            self.assertEqual(session["curr_user"], user.id)

    def test_non_exist_user_login(self):
        "test non-exist user login"

        with self.client as c:
            resp = c.post('/login', data={
                "username": "test3",
                "password": "123456",
            }, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Invalid credentials", html)


class SearchTestCase(TestCase):
    """test search functions"""

    def setUp(self):
        """Create test user, add sample data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.user1 = User.signup(**USER_DATA1)
        self.user1.id = 100

        db.session.add(self.user1)
        db.session.commit()

    def test_render_search_page(self):
        """render the search page"""

        with self.client as c:
            resp = c.get("/search")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Find My Favorites!</h1>", html)

    def test_search_function(self):
        """return search result"""

        with self.client as c:
            resp = c.post("/search", json={"term": "brandy", "media": "music",
                                           "entity": "song", "country": "US", "limit": 10, "lang": "en"})
            data = resp.json
            self.assertEqual(resp.status_code, 200)
            self.assertLessEqual(len(data), 10)
            self.assertTrue("country" in data[0])

    def test_search_no_results(self):
        """search for something not exist"""

        with self.client as c:
            resp = c.post("/search", json={"term": "asdfasdfasdfasdf", "media": "music",
                                           "entity": "song", "country": "US", "limit": 10, "lang": "en"})
            data = resp.json
            self.assertEqual(resp.status_code, 200)
            self.assertLessEqual(len(data), 0)


class favTestCase(TestCase):
    """test fav functions and views"""

    def setUp(self):
        """Create test user, add sample data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.user1 = User.signup(**USER_DATA1)
        self.user1.id = 100

        db.session.add(self.user1)
        db.session.commit()

    def test_update_favor(self):
        """test user add/delete favor to a song"""

        with self.client as c:
            resp = c.post('/login', data={
                "username": "test1",
                "password": "123456",
            }, follow_redirects=True)
            search = c.post("/search", json={"term": "brandy", "media": "music",
                                             "entity": "song", "country": "US", "limit": 10, "lang": "en"})
            data = search.json[0]
            data.pop("isFavor", None)

            fav_item = c.post("/update-fav", json=data)
            user = User.query.filter_by(username="test1").first()
            self.assertEqual(fav_item.get_json(), {
                'message': 'successfully added'})
            self.assertEqual(user.favors[0].user_id, 100)

            delete_fav_item = c.post("/update-fav", json=data)
            user = User.query.filter_by(username="test1").first()
            self.assertEqual(delete_fav_item.get_json(), {
                'message': 'successfully deleted'})
            self.assertEqual(user.favors, [])

    def test_unauthorized_update_favor(self):
        """test visiter access update favor route"""

        with self.client as c:
            search = c.post("/search", json={"term": "brandy", "media": "music",
                                             "entity": "song", "country": "US", "limit": 10, "lang": "en"})
            data = search.json[0]
            resp = c.post("/update-fav", json=data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized.", html)


class favPageAndView(TestCase):
    """test fav functions and views"""

    def setUp(self):
        """Create test user, add sample data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.user1 = User.signup(**USER_DATA1)
        self.user1.id = 100

        db.session.add(self.user1)
        db.session.commit()

    def test_render_fav_page(self):
        """test logged in user access favorite page"""

        with self.client as c:
            login = c.post('/login', data={
                "username": "test1",
                "password": "123456",
            }, follow_redirects=True)

            resp = c.get('/favorites')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn(
                'My Favorites List</h1>', html)

    def test_get_fav_data(self):
        """test return fav data"""

        with self.client as c:
            login = c.post('/login', data={
                "username": "test1",
                "password": "123456",
            }, follow_redirects=True)
            search = c.post("/search", json={"term": "brandy", "media": "music",
                                             "entity": "song", "country": "US", "limit": 10, "lang": "en"})
            data = search.json[0]
            data.pop("isFavor", None)

            fav_item = c.post("/update-fav", json=data)

            resp = c.get("/favoriteslist")
            fav_data = resp.json
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(data["trackId"], fav_data[0]["trackId"])


def test_unauthorized_fav_access(self):
    """test unlogged in user access favorite page"""

    with self.client as c:
        resp = c.get('/favorites', follow_redirects=True)
        html = resp.get_data(as_text=True)

        self.assertEqual(resp.status_code, 200)
        self.assertIn("Access unauthorized.", html)


class TasteTestCase(TestCase):
    """test taste views and functions"""

    def setUp(self):
        """Create test user, add sample data."""

        db.drop_all()
        db.create_all()

        self.client = app.test_client()

        self.user1 = User.signup(**USER_DATA1)
        self.user1.id = 100

        db.session.add(self.user1)
        db.session.commit()

    def test_render_taste_page(self):
        """test logged in user access taste page"""

        with self.client as c:
            login = c.post('/login', data={
                "username": "test1",
                "password": "123456",
            }, follow_redirects=True)
            resp = c.get('/taste')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn(
                'My Music Taste</h1>', html)

    def test_unauthorized_taste_access(self):
        """test unlogged in user access taste page"""

        with self.client as c:
            resp = c.get('/taste', follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("Access unauthorized.", html)

    def test_get_taste_data(self):
        """test return taste data"""

        with self.client as c:
            login = c.post('/login', data={
                "username": "test1",
                "password": "123456",
            }, follow_redirects=True)
            search = c.post("/search", json={"term": "brandy", "media": "music",
                                             "entity": "song", "country": "US", "limit": 10, "lang": "en"})
            data = search.json[0]
            data.pop("isFavor", None)

            fav_item = c.post("/update-fav", json=data)

            resp = c.get("/tastedata")
            taste_data = resp.json
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(len(taste_data), 1)
            self.assertEqual(taste_data[0]["name"], data["primaryGenreName"])


class testErrorPage(TestCase):
    """test access route not exist"""

    def test_access_non_exist_page(self):
        """test return non-exist page"""
        self.client = app.test_client()
        with self.client as c:
            resp = c.get("/notexist")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 404)
            self.assertIn(
                "Sorry, this is not the page you're looking for.", html)
