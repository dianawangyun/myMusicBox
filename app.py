from flask import Flask, render_template, request, jsonify
from flask import session, make_response
import requests

app = Flask(__name__)

app.config['SECRET_KEY'] = "hellosecret123"
API_BASE_URL = "https://itunes.apple.com/search"


@app.route("/", methods=["GET", "POST"])
def show_resp():
    if request.method == 'POST':
        req = request.json
        res = requests.get(API_BASE_URL, params=req).json().get("results")
        # import pdb
        # pdb.set_trace()
        s_res = [serialize_response(item) for item in res]
        session["searchRes"] = s_res
        return jsonify(s_res)
    else:
        return render_template("home.html")


def serialize_response(res):
    artworkUrl = res.get(
        "artworkUrl100", "https://vcunited.club/wp-content/uploads/2020/01/No-image-available-2.jpg").replace("100x100", "300x300")
    # import pdb
    # pdb.set_trace()
    return {
        'kind': res.get("kind"),
        'primaryGenreName': res.get("primaryGenreName"),
        'collectionId': res.get("collectionId"),
        'collectionName': res.get("collectionName"),
        'trackCount': res.get("trackCount"),
        'trackViewUrl': res.get("trackViewUrl"),
        'trackId': res.get("trackId"),
        'trackName': res.get("trackName"),
        'trackNumber':res.get('trackNumber'),
        'artistId': res.get("artistId"),
        'artistName': res.get("artistName"),
        'artistViewUrl': res.get("artistViewUrl"),
        'previewUrl': res.get("previewUrl"),
        'artworkUrl': artworkUrl,
        'releaseDate': res.get("releaseDate"),
        'collectionPrice': res.get("collectionPrice"),
        'trackPrice': res.get("trackPrice"),
        'currency': res.get("currency"),
        'country': res.get("country")
    }
