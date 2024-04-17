# pip install midi
from midiutil.MidiFile import MIDIFile
import os


def string_parse(in_str):
    duration = in_str[1]
    note = in_str[0]

    midi_value = 79 - note 
    
    return duration, midi_value

def populate_midi(notes, tempo):
    path = "output.midi"
    mf = MIDIFile(1)     # only 1 track
    track = 0   # the only track
    time = 0    # start at the beginning
    channel = 0
    volume = 100
    tempo = int(tempo)
    mf.addTrackName(track, time, "Sample Track")
    mf.addTempo(track, time, tempo)
    for note_time, pitches in enumerate(notes):
        for pitch in pitches:
            duration, note_value = string_parse(pitch)
            mf.addNote(track, channel, note_value, note_time, duration, volume)
    
    descriptor = os.open(path=path, 
                         flags=(
                             os.O_WRONLY 
                             | os.O_CREAT
                             | os.O_TRUNC
                         ),
                         mode=0o777)

    with open(descriptor, 'wb') as outf:
        mf.writeFile(outf)
    return "output.midi"

