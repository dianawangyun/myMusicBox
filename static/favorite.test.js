describe("test favorite page related functions", function () {
    it("should show favorite items if USER LOGGED IN", async function () {
        await getFavList();
        if ($("#logout").length > 0) {
            expect($("#my-fav-wrap li").length).toBeGreaterThan(0);
        }
    });
});

const favList = [
    {
        artistId: 195091912,
        artistName: "Marc-Andr\u00e9 Hamelin",
        artistViewUrl:
            "https://music.apple.com/us/artist/marc-andr%C3%A9-hamelin/195091912?uo=4",
        artworkUrl:
            "https://is2-ssl.mzstatic.com/image/thumb/Music/v4/5b/36/32/5b363249-374a-8b6d-3493-e435ca336968/source/300x300bb.jpg",
        collectionId: 567925715,
        collectionName: "Kapustin: Piano Music, Vol. 2",
        collectionPrice: 10.99,
        country: "USA",
        currency: "USD",
        isFavor: true,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/Music/b2/20/cd/mzi.nsxgxxon.aac.p.m4a",
        primaryGenreName: "Classical",
        releaseDate: "2004-06-01T12:00:00Z",
        trackCount: 24,
        trackId: 567925793,
        trackName: "Eight Concert \u00c9tudes, Op. 40: II. Dream: Moderato",
        trackNumber: 3,
        trackPrice: 0.99,
        trackViewUrl:
            "https://music.apple.com/us/album/eight-concert-%C3%A9tudes-op-40-ii-dream-moderato/567925715?i=567925793&uo=4",
    },
    {
        artistId: 268839547,
        artistName: "Nikolai Kapustin",
        artistViewUrl:
            "https://music.apple.com/us/artist/nikolai-kapustin/268839547?uo=4",
        artworkUrl:
            "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/48/34/e4/4834e46f-f6d8-26d5-a877-b9dfc98e0453/source/300x300bb.jpg",
        collectionId: 1511422855,
        collectionName: "Nikolai Kapustin: Jazz Pieces for Piano",
        collectionPrice: 9.99,
        country: "USA",
        currency: "USD",
        isFavor: true,
        kind: "song",
        previewUrl:
            "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/ce/4b/72/ce4b721e-a13a-190a-24a3-ddcb5415645f/mzaf_2296553174387221400.plus.aac.p.m4a",
        primaryGenreName: "Jazz",
        releaseDate: "2017-12-15T12:00:00Z",
        trackCount: 7,
        trackId: 1511423076,
        trackName: "Motive Force, Op. 45",
        trackNumber: 7,
        trackPrice: 0.99,
        trackViewUrl:
            "https://music.apple.com/us/album/motive-force-op-45/1511422855?i=1511423076&uo=4",
    },
];
