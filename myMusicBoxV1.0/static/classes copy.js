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
    }

    DrawDetailPage() {}
}

class SongMusic extends Song {
    constructor(item) {
        super(item);
        this.element = $("<li/>").html(`
        <div class="card" style="width: 20rem;" class="mr-2 mb-2">
        <div class="player-wrapper">
          <img src="${this.artworkUrl}" class="card-img-top img-fluid max-height:100% rounded" alt="Album Cover">
          <div class="cover">
            <div class="cover-icon play"></div>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${this.trackName}</h5>
          <p class="card-text">Album: ${this.collectionName}</p>
          <p class="card-text">Artist: ${this.artistName}</p>
          <button type="button" class="btn btn-primary mr-4 detail">Check Details</button>
          <button type="button" class="btn btn-outline-danger favor">I Like This!</button>
        </div>
      </div>`);
        this.element.find(".cover").click(() => {
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
        });

        this.element.find(".detail").click(() => {
            $("#detail-cover").attr("src", this.artworkUrl);
            let detailTable = $("<table/>").addClass("table table-hover");
            let detailBody = $("<tbody/>").html(`
          <tr>
          <td>Song</td><td>${this.trackName}</td></tr>
          <tr><td>Artist</td><td><a href="${
              this.artistViewUrl
          }" target="_blank">${this.artistName}</a></td></tr>
            <tr><td>Genre</td><td>${this.primaryGenreName}</td></tr>
            <tr><td>Album</td><td>${this.collectionName}</td></tr>
            <tr><td>Total Tracks</td><td>${this.trackCount}</td></tr>
            <tr><td>Track# of this Song</td><td>${this.trackNumber}</td></tr>
            <tr><td>Release Date</td><td>${this.releaseDate.slice(
                0,
                10
            )}</td></tr>
            <tr><td>Release Country</td><td>${this.country}</td></tr>
            <tr><td>Album Price</td><td>${this.currency} ${
                this.collectionPrice
            }</td></tr>
            <tr><td>Track Price</td><td>${this.currency} ${
                this.trackPrice
            }</td></tr>
            <tr><td>Check on Itunes</td><td><a href="${
                this.trackViewUrl
            }" target="_blank">Click Here</a></td></tr>
          `);
            detailTable.append(detailBody);
            $("#detail-wrapper").html(detailTable);
            $("#detail-modal").modal("show");
        });
    }
}

class SongVideo extends SongMusic {
    constructor(item) {
        super(item);
        this.element = $("<li>").html(`
    <div class="card" style="width: 20rem;" class="mr-2">
      <div class="player-wrapper">
        <img src="${this.artworkUrl}" class="card-img-top" alt="Album Cover">
        <div class="cover">
          <div class="cover-icon play"></div>
        </div>
      </div>
      <div class="card-body">
        <h5 class="card-title">${this.trackName}</h5>
        <p class="card-text">Album: ${this.collectionName}</p>
        <p class="card-text">Artist: ${this.artistName}</p>
        <button type="button" class="btn btn-primary mr-4 detail">Check Details</button>
        <button type="button" class="btn btn-outline-danger favor">I Like This!</button>
      </div>
    </div>`);

        this.element.find(".player-wrapper").click(() => {
            $("#video-title").text(`${this.trackName} - ${this.artistName}`);
            if (this.previewUrl) {
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
        });
    }
}
