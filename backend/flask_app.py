from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Okay so here we're going to take a file probably and return a file, or maybe we could get the button information 
# and construct the midi here, since that might be easier than passing around a midi file. 
@app.route("/")
def home():
  the_stuff = gonna_do_some_stuff()
  return f"Hello, cross-origin-world!, {the_stuff}"


def gonna_do_some_stuff():
  return "I CALLED A FUNCTION"