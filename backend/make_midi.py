# pip install midi
from midiutil.MidiFile import MIDIFile

START_OF_ARRAY = 41     # Bottom G note. 
TOP_OF_ARRAY = 79       # Top G note. 

def populate_midi(notes, tempo):
    mf = MIDIFile(1)     # only 1 track
    track = 0   # the only track
    time = 0    # start at the beginning
    channel = 0
    volume = 100

    mf.addTrackName(track, time, "Sample Track")
    mf.addTempo(track, time, tempo)
    for pitch, note_time in notes:
        for time_step, is_on in enumerate(note_time):
            if is_on:
                mf.addNote(track, channel, TOP_OF_ARRAY - pitch, note_time, 1, volume)
