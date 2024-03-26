# pip install midi
from midiutil.MidiFile import MIDIFile

START_OF_ARRAY = 41     # Bottom G note. 
TOP_OF_ARRAY = 79       # Top G note. 

note = {
    "G": 41,
    "A": 43,
    "B": 45,
    "C": 46,
    "D": 48,
    "E": 50,
    "F": 51,
}

octave = {
    2: 0,
    3: 11,
    4: 22,
    5: 33,
    6: 44, 
    7: 55,
}

def string_parse(in_str):
    duration = 1
    str_location = 0
    if in_str[str_location].isdigit():
        if in_str[str_location + 1].isdigit():
            raise Exception("Cant sustain notes that long, for now.")
        duration = int(in_str[0])
        str_location += 1

    start = note[in_str[str_location]]
    str_location += 1
    modify = 0
    if in_str[str_location].isdigit():
        modify = octave[int(in_str[str_location])]
        str_location += 1
    else:
        if in_str[str_location] == "#":
            modify += 1
            str_location += 1
        else:
            raise Exception("Unrecognized symbol (use only sharps for note modifers, not flats.)")
        modify = octave[int(in_str[str_location])]
        str_location += 1
    start += modify
    return duration, start

def populate_midi(notes, tempo):
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

    with open("output.midi", 'wb') as outf:
        mf.writeFile(outf)
    return "output.midi"
