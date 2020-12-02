const songItem = {
    artistId: 17416,
    artistName: "Brandy & Monica",
    artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
    artworkUrl:
        "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/34/08/83/340883d9-0ff5-a0a0-030b-c424df32c570/source/300x300bb.jpg",
    collectionId: 20913004,
    collectionName: "Never Say Never",
    collectionPrice: 9.99,
    country: "USA",
    currency: "USD",
    isFavor: false,
    kind: "song",
    previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/Music/b2/69/84/mzm.yprdowuu.aac.p.m4a",
    primaryGenreName: "Pop",
    releaseDate: "1998-05-19T07:00:00Z",
    trackCount: 16,
    trackId: 20913041,
    trackName: "The Boy Is Mine",
    trackNumber: 3,
    trackPrice: 1.29,
    trackViewUrl:
        "https://music.apple.com/us/album/the-boy-is-mine/20913004?i=20913041&uo=4",
};

const videoItem = {
    artistId: 17416,
    artistName: "Brandy",
    artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
    artworkUrl:
        "https://is5-ssl.mzstatic.com/image/thumb/Video/v4/03/e3/0c/03e30c6a-8f29-68c0-4ac8-1b4fba3f8dac/source/300x300bb.jpg",
    collectionId: 297746999,
    collectionName: "Human (Deluxe Version)",
    collectionPrice: 12.99,
    country: "USA",
    currency: "USD",
    isFavor: false,
    kind: "music-video",
    previewUrl:
        "https://video-ssl.itunes.apple.com/itunes-assets/Video125/v4/56/61/0d/56610dcd-fa98-5aaa-0c50-abd29b277214/mzvf_5609909583797915396.640x464.h264lc.U.p.m4v",
    primaryGenreName: "R&B/Soul",
    releaseDate: "2008-12-05T08:00:00Z",
    trackCount: 20,
    trackId: 297747217,
    trackName: "Right Here (Departed)",
    trackNumber: 20,
    trackPrice: 1.99,
    trackViewUrl:
        "https://music.apple.com/us/music-video/right-here-departed/297747217?uo=4",
};

describe("test Song class's methods", function () {
    let song = new Song(songItem);

    it("should fill the detail page with information", function () {
        song.drawDetailPage();
        $("#detail-modal").modal("hide");
        expect($("#detail-wrapper table tbody tr td").eq(1).text()).toEqual(
            songItem.trackName
        );
    });

    it("should create and return a li item, show fav button if logged in, not if logged out", function () {
        let $li = song.createElement();
        let $logout = $("#logout");
        expect($li[0].innerText).toContain(songItem.artistName);
        if ($logout.length === 0) {
            expect($li.eq(0).find("button").length).toBeGreaterThanOrEqual(1);
        } else {
            expect($li.eq(0).find("button").length).toBeGreaterThanOrEqual(2);
        }
    });
});

describe("test SongMusic class's methods", function () {
    let music = new SongMusic(songItem);

    it("should be able to init music player", function () {
        music.initPlayer();
        expect($("#audio-player").attr("src")).toEqual(music.previewUrl);
        expect(music.element.find(".cover-icon").hasClass("play")).toBeFalsy();
    });
});

describe("test SongVideo class's methods", function () {
    let video = new SongVideo(videoItem);

    it("should be able to init video player", function () {
        video.initPlayer();
        expect($("#video-title").text()).toContain(video.trackName);
        expect($("#video-player").attr("src")).toEqual(video.previewUrl);
    });
});
