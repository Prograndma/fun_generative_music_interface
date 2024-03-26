### HOW TO USE THIS FILE
### or more specifically, how to run it locally
### pip install flask in an intelligent way. 
### (in the terminal, in the backend directory)
### flask --app flask_app.py run
### that is it. 

from flask import Flask
from flask import request
from flask_cors import CORS
from make_midi import populate_midi
import json

app = Flask(__name__)
CORS(app)


# Okay so here we're going to take a file probably and return a file, or maybe we could get the button information 
# and construct the midi here, since that might be easier than passing around a midi file. 
@app.route("/", methods=["POST"])
def home():
  a = json.loads(request.data)
  midi = populate_midi(a["notes"], a["songTempo"])
  return midi
