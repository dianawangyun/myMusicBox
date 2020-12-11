# MyMusicBox

This small app uses Itunes Search API to easily search for music tracks and videos released in different countries. It can fetch information and provide 30s preview for each search result. Once logged in, the user can add searching results to favorite list and show his/her music preference based on the favorite list created.

Technology stacks used in this app:

- 3rd party API: Itunes Search API

- Front-end: jQuery, Axios, BootStrap, Less, ECharts, Masonry

- Back-end: Python, Flask, Flask-WTF, Flask-SQLAlchemy, bcrypt

- Database: PostgreSQL

## Setup

1. Use the requirements.txt to install all the dependencies
   1. make sure pip is installed (if not please download and install [python3](https://www.python.org/downloads/) first)
   2. open a command line console, cd to the folder of the app, create a virtual environment(highly recommended if possible), then run the command "pip install -r requirements.txt"
2. Config the seed.py and start the server
   1. make sure postgreSQL is installed and setup (if not please download and install [postgreSQL](https://www.postgresql.org/download/) first)
   2. open seed.py inside the app folder, set the value on line 6 and 7 to your user name and password for postgreSQL
   3. go back to the command line console, run the command "flask run" to start the server
3. Access the app via a browser
   1. Open Chrome or other browser, type in "127.0.0.1:5000" or "localhost:5000" in the address bar
   2. find your favorites!

## URL to this repository

https://github.com/dianawangyun/myMusicBox

## Heroku URL

https://my-music-box-wy.herokuapp.com/

The following test account could be used to have quick access to the features.

Username: test

password: 123456