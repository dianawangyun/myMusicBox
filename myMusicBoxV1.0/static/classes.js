/* class with properties and common methods */
class Song {
    constructor(item) {
        this.kind = item.kind;
        this.primaryGenreName = item.primaryGenreName;
        this.collectionId = item.collectionId;
        this.collectionName = item.collectionName;
        this.trackCount = item.trackCount;
        this.trackViewUrl = item.trackViewUrl;
        this.trackId = item.trackId;
        this.trackName = item.trackName;
        this.trackNumber = item.trackNumber;
        this.artistId = item.artistId;
        this.artistName = item.artistName;
        this.artistViewUrl = item.artistViewUrl;
        this.previewUrl = item.previewUrl;
        this.artistViewUrl = item.artistViewUrl;
        this.artworkUrl = item.artworkUrl;
        this.releaseDate = item.releaseDate;
        this.collectionPrice = item.collectionPrice;
        this.trackPrice = item.trackPrice;
        this.currency = item.currency;
        this.country = item.country;
        this.isFavor = item.isFavor;
    }

    /* draw a table for showing details of a song instance */
    drawDetailPage() {
        $("#detail-cover").attr("src", this.artworkUrl);
        let detailTable = $("<table/>").addClass("table table-hover");
        let detailBody = $("<tbody/>").html(`
  <tr>
  <td>Song</td><td>${this.trackName}</td></tr>
  <tr><td>Artist</td><td><a href="${this.artistViewUrl}" target="_blank">${
            this.artistName
        }</a></td></tr>
    <tr><td>Genre</td><td>${this.primaryGenreName}</td></tr>
    <tr><td>Album</td><td>${this.collectionName}</td></tr>
    <tr><td>Total Tracks</td><td>${this.trackCount}</td></tr>
    <tr><td>Track# of this Song</td><td>${this.trackNumber}</td></tr>
    <tr><td>Release Date</td><td>${this.releaseDate.slice(0, 10)}</td></tr>
    <tr><td>Release Country</td><td>${this.country}</td></tr>
    <tr><td>Album Price</td><td>${this.collectionPrice} ${
            this.currency
        }</td></tr>
    <tr><td>Track Price</td><td>${this.trackPrice} ${this.currency}</td></tr>
    <tr><td>Check on Itunes</td><td><a href="${
        this.trackViewUrl
    }" target="_blank">Click Here</a></td></tr>
  `);
        detailTable.append(detailBody);
        $("#detail-wrapper").html(detailTable);
        $("#detail-modal").modal("show");
    }

    /* check if the user is logged in and draw a favor button to logged in user */
    showAddFavorBtn($li) {
        if ($("#logout").length > 0) {
            let $favBtn = $("<button/>", {
                type: "button",
                class: "btn btn-outline-danger favor",
                text: "I Like This! ",
            });
            let $icon = $("<i/>").addClass("far fa-heart").appendTo($favBtn);
            $li.find(".card-body").append($favBtn);
            if (this.isFavor) {
                $favBtn.attr("class", "btn btn-danger favor");
                $icon.attr("class", "fas fa-heart");
            }
        }
    }

    /* remove isFavor and element from "this" before sending to backend */
    toJSON() {
        const data = { ...this };
        delete data.isFavor;
        delete data.element;
        return data;
    }

    /* save user favor to database */
    async updateFav() {
        try {
            const data = this;
            const response = await axios.post(`${BASE_URL}/update-fav`, data);
            // console.log(response.data);
            this.isFavor = !this.isFavor;
        } catch (err) {
            console.log(err);
        }
    }

    /* toggle the favor button style */
    changeBtnStyle() {
        let $favBtn = this.element.find(".favor");
        let $icon = $favBtn.find("i");
        $favBtn.toggleClass("btn-danger btn-outline-danger");
        $icon.toggleClass("fas far");
    }
}

class SongMusic extends Song {
    constructor(item) {
        super(item);
        // create its own element here
        this.element = this.createElement();
        this.element.find(".cover").click(() => {
            this.initPlayer();
        });
        this.element.find(".detail").click(() => {
            this.drawDetailPage();
        });
    }

    createElement() {
        let $li = $("<li/>")
            .html(
                `
    <div class="card" style="width: 20rem;" class="mr-2 mb-2">
    <div class="player-wrapper">
      <img data-src="${this.artworkUrl}" class="lazy card-img-top img-fluid max-height:100% rounded" alt="Album Cover">
      <div class="cover">
        <div class="cover-icon play"></div>
      </div>
    </div>
    <div class="card-body">
      <h5 class="card-title">${this.trackName}</h5>
      <p class="my-2">Artist: ${this.artistName}</p>
      <p class="mb-4">Album: ${this.collectionName}</p>
      <button type="button" class="btn btn-primary mr-4 detail">Check Details</button>
    </div>
  </div>`
            )
            .addClass("mb-4 mr-md-5");
        this.showAddFavorBtn($li);
        return $li;
    }

    /* control the play and pause of audio player */
    initPlayer() {
        let $audio = $("#audio-player");
        let $icon = this.element.find(".cover-icon");
        $audio.attr("src", this.previewUrl);
        $audio[0].onended = function () {
            $icon.removeClass("pause").addClass("play");
        };
        if ($icon.hasClass("play")) {
            $audio[0].play();
            $(".cover-icon").removeClass("pause").addClass("play");
            $icon.removeClass("play").addClass("pause");
        } else {
            $audio[0].pause();
            $icon.removeClass("pause").addClass("play");
        }
    }
}

class SongVideo extends Song {
    constructor(item) {
        super(item);
        // create its own element here
        this.element = this.createElement();
        this.element.find(".detail").click(() => {
            this.drawDetailPage();
        });

        this.element.find(".player-wrapper").click(() => {
            this.initPlayer();
        });
    }

    createElement() {
        let $li = $("<li>")
            .html(
                `
        <div class="card" style="width: 20rem;" class="mr-2">
          <div class="player-wrapper">
          <img data-src="${this.artworkUrl}" class="lazy card-img-top" alt="Album Cover">
            <div class="cover">
              <div class="cover-icon play"></div>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${this.trackName}</h5>
            <p class="my-2">Artist: ${this.artistName}</p>
            <p class="mb-4">Album: ${this.collectionName}</p>
            <button type="button" class="btn btn-primary mr-4 detail">Check Details</button>
          </div>
        </div>`
            )
            .addClass("mb-4 mr-md-5");
        this.showAddFavorBtn($li);
        return $li;
    }

    initPlayer() {
        $("#video-title").text(`${this.trackName} - ${this.artistName}`);
        if (this.previewUrl !== "N/A") {
            $("#video-player").attr("src", this.previewUrl);
            $("#video-info").text("");
        } else {
            $("#video-player").attr("src", "");
            $("#video-info").text(
                "Oops, there is no preview for this music video..."
            );
        }
        $("#video-modal").modal("show");
        $("#video-modal").on("hidden.bs.modal", function () {
            $("#video-player")[0].pause();
        });
    }
}
