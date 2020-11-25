# API and Database Schema of myMusicBox

## 1. API Choice
### **iTunes Search API**

Usage: user search artist/track/album name and return related results with 30 seconds of preview

Doc page: https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/

end points: [https://itunes.apple.com/search](https://itunes.apple.com/search?term=jack+johnson&limit=25)


**request example:**

params: {term: "Nikolai Kapustin", media: "music", entity: "song", country: "US", limit: 50, lang: "en"}

**response structure:**

```
  {
  	"resultCount": 50,
  	"results": [{
  			"wrapperType": "track",
  			"kind": "song",
  			"artistId": 195091912,
  			"collectionId": 567925715,
  			"trackId": 567925792,
  			"artistName": "Marc-André Hamelin",
  			"collectionName": "Kapustin: Piano Music, Vol. 2",
  			"trackName": "Eight Concert Études, Op. 40: I. Prelude: Allegro assai",
  			"collectionCensoredName": "Kapustin: Piano Music, Vol. 2",
  			"trackCensoredName": "Eight Concert Études, Op. 40: I. Prelude: Allegro assai",
  			"artistViewUrl": "https://music.apple.com/us/artist/marc-andr%C3%A9-hamelin/195091912?uo=4",
  			"collectionViewUrl": "https://music.apple.com/us/album/eight-concert-%C3%A9tudes-op-40-i-prelude-allegro-assai/567925715?i=567925792&uo=4",
  			"trackViewUrl": "https://music.apple.com/us/album/eight-concert-%C3%A9tudes-op-40-i-prelude-allegro-assai/567925715?i=567925792&uo=4",
  			"previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/Music/c9/8d/ca/mzi.zlbgbugx.aac.p.m4a",
  			"artworkUrl30": "https://is2-ssl.mzstatic.com/image/thumb/Music/v4/5b/36/32/5b363249-374a-8b6d-3493-e435ca336968/source/30x30bb.jpg",
  			"artworkUrl60": "https://is2-ssl.mzstatic.com/image/thumb/Music/v4/5b/36/32/5b363249-374a-8b6d-3493-e435ca336968/source/60x60bb.jpg",
  			"artworkUrl100": "https://is2-ssl.mzstatic.com/image/thumb/Music/v4/5b/36/32/5b363249-374a-8b6d-3493-e435ca336968/source/100x100bb.jpg",
  			"collectionPrice": 10.99,
  			"trackPrice": 0.99,
  			"releaseDate": "2004-06-01T12:00:00Z",
  			"collectionExplicitness": "notExplicit",
  			"trackExplicitness": "notExplicit",
  			"discCount": 1,
  			"discNumber": 1,
  			"trackCount": 24,
  			"trackNumber": 2,
  			"trackTimeMillis": 116200,
  			"country": "USA",
  			"currency": "USD",
  			"primaryGenreName": "Classical",
  			"isStreamable": false
  		},
  		{...}
  	]
  }
  ```

Note: Since there is no way to directly return a specific track through this API, once the user favor a track, several fields would be inserted into songs table to create a favorite list.

## 2. Database Schema
Three tables would be created in the Database to be used to store user data, song data and favorite relation of users and songs.

**User**  

id int primary  
email text unique  
username text required unique  
password text required  
admin boolean  


**Song**

trackId integer primary_key  
kind string(15)  
primaryGenreName string(30)  
collectionId int  
collectionName text  
trackCount int  
trackViewUrl text  
trackName int  
trackNumber int  
artistId int  
artistName text  
artistViewUrl text  
previewUrl text  
artworkUrl text  
releaseDate text  
collectionPrice float  
trackPrice float  
currency string(10)  

**Favors**

user_id int foreignKey(User.id) primary  
song_id int foreignKey(Song.trackId) primary  
remark string(150)  
favorite_date dateTime  
