### HOW TO USE THIS FILE
### or more specifically, how to run it locally
### pip install flask in an intelligent way. 
### (in the terminal, in the backend directory)
### flask --app flask_app.py run
### that is it. 

from flask import Flask, request, send_file, make_response
from flask_cors import CORS
from make_midi import populate_midi
import json
from qilexgpt2piano_generator import MidiGenerator

app = Flask(__name__)
CORS(app)

generator = MidiGenerator()

# Okay so here we're going to take a file probably and return a file, or maybe we could get the button information 
# and construct the midi here, since that might be easier than passing around a midi file. 
@app.route("/", methods=["POST"])
def home():
  a = json.loads(request.data)
  # print(a["notes"])
  midi = populate_midi(a["notes"], a["songTempo"])
  midi = generator.condition_on_existing(midi)
  try:
    return send_file(f"{midi}", as_attachment=True)
  except Exception as e:
    print(e)
    return make_response(f"Error: {e}", 500)
