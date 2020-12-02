describe("test app.js draw results on the page", function () {
    beforeEach(function () {
        $("#results-container").html("");
    });

    it("should draw 10 lis on the page", function () {
        drawResultList(
            $("#results-container"),
            resList,
            "Sorry, no matched results..."
        );
        let lis = $("#results-container li");
        expect(lis.length).toEqual(10);
    });

    it("should return info text", function () {
        let resList = "";
        drawResultList(
            $("#results-container"),
            resList,
            "Sorry, no matched results..."
        );
        let li = $("#results-container li");
        expect(li.length).toEqual(1);
        expect(li[0].innerText).toContain("no matched results");
    });
});

const resList = [
    {
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
    },
    {
        artistId: 17416,
        artistName: "Brandy",
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
            "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview71/v4/6b/4d/47/6b4d4798-f982-8dec-760c-cb1aa827e46d/mzaf_2826169303402197055.plus.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "1998-06-09T07:00:00Z",
        trackCount: 16,
        trackId: 20913108,
        trackName: "Have You Ever",
        trackNumber: 10,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/have-you-ever/20913004?i=20913108&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is5-ssl.mzstatic.com/image/thumb/Music/v4/d1/4d/53/d14d53bf-6554-9934-2de3-a5fc614d4765/source/300x300bb.jpg",
        collectionId: 523226143,
        collectionName: "Put It Down (feat. Chris Brown)",
        collectionPrice: 1.29,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/01/7b/de/mzm.mesheggt.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "2012-05-04T07:00:00Z",
        trackCount: 1,
        trackId: 523226147,
        trackName: "Put It Down (feat. Chris Brown)",
        trackNumber: 1,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/put-it-down-feat-chris-brown/523226143?i=523226147&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/b3/ee/0c/b3ee0c2d-e9b7-0ab1-bca3-b7aa89706645/source/300x300bb.jpg",
        collectionId: 297746999,
        collectionName: "Human (Deluxe Version)",
        collectionPrice: 12.99,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/e4/50/a1/mzm.gdvmfces.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "2008-09-09T12:00:00Z",
        trackCount: 19,
        trackId: 297747065,
        trackName: "Right Here (Departed)",
        trackNumber: 4,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/right-here-departed/297746999?i=297747065&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/27/71/d6/2771d61c-697a-0062-572b-495df9a790f2/source/300x300bb.jpg",
        collectionId: 321974621,
        collectionName: "Brandy",
        collectionPrice: 10.99,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/3d/c2/81/mzm.gbmsquoq.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "1994-09-06T07:00:00Z",
        trackCount: 14,
        trackId: 321974628,
        trackName: "I Wanna Be Down",
        trackNumber: 4,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/i-wanna-be-down/321974621?i=321974628&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/63/5a/16/635a1617-9c04-72f6-1161-c46246175023/source/300x300bb.jpg",
        collectionId: 302482579,
        collectionName: "Right Here (Departed) [Remixes]",
        collectionPrice: 4.99,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/04/3e/82/mzm.eswukrzh.aac.p.m4a",
        primaryGenreName: "Dance",
        releaseDate: "2009-01-27T12:00:00Z",
        trackCount: 7,
        trackId: 302482647,
        trackName: "Right Here (Departed) [Seamus & Emanuel Dub Mix]",
        trackNumber: 7,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/right-here-departed-seamus-emanuel-dub-mix/302482579?i=302482647&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is3-ssl.mzstatic.com/image/thumb/Music1/v4/54/a4/13/54a4134d-6b8a-66f1-5b41-1f4b192ce802/source/300x300bb.jpg",
        collectionId: 216124789,
        collectionName: "Waiting to Exhale (Original Soundtrack Album)",
        collectionPrice: 9.99,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/bc/7f/72/mzm.zqswgvqj.aac.p.m4a",
        primaryGenreName: "Soundtrack",
        releaseDate: "1995-11-14T08:00:00Z",
        trackCount: 16,
        trackId: 216125113,
        trackName: "Sittin' Up In My Room",
        trackNumber: 5,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/sittin-up-in-my-room-lp-version/216124789?i=216125113&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
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
            "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview19/v4/5d/7c/6f/5d7c6fb3-395d-dbce-cf7e-01985f4c6dfc/mzaf_1779799213069506743.plus.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "1998-06-09T07:00:00Z",
        trackCount: 16,
        trackId: 20913093,
        trackName: "Almost Doesn't Count",
        trackNumber: 5,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/almost-doesnt-count/20913004?i=20913093&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/27/71/d6/2771d61c-697a-0062-572b-495df9a790f2/source/300x300bb.jpg",
        collectionId: 321974621,
        collectionName: "Brandy",
        collectionPrice: 10.99,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/18/8c/18/mzm.hnovvubo.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "1994-09-27T07:00:00Z",
        trackCount: 14,
        trackId: 321974627,
        trackName: "Best Friend",
        trackNumber: 3,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/best-friend/321974621?i=321974627&uo=4",
    },
    {
        artistId: 17416,
        artistName: "Monica & Brandy",
        artistViewUrl: "https://music.apple.com/us/artist/brandy/17416?uo=4",
        artworkUrl:
            "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/10/9c/1b/109c1b03-f925-b72b-5538-2566f0d0ee1a/source/300x300bb.jpg",
        collectionId: 510442828,
        collectionName: "New Life (Deluxe Version)",
        collectionPrice: 11.99,
        country: "USA",
        currency: "USD",
        isFavor: false,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/93/c7/49/mzm.kkuerufp.aac.p.m4a",
        primaryGenreName: "R&B/Soul",
        releaseDate: "2012-04-06T07:00:00Z",
        trackCount: 16,
        trackId: 510442864,
        trackName: "It All Belongs to Me",
        trackNumber: 2,
        trackPrice: 1.29,
        trackViewUrl:
            "https://music.apple.com/us/album/it-all-belongs-to-me/510442828?i=510442864&uo=4",
    },
];
