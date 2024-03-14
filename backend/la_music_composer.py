import TMIDIX
import statistics
from midi2audio import FluidSynth
import matplotlib.pyplot as plt


render_MIDI_to_audio = True    # @param {type:"boolean"}

print('Los Angeles Music Composer Seed MIDI Loader')

print('Upload your own custom MIDI...')
grabbing_from_filesystem = True
if grabbing_from_filesystem:
    # use this one if actually running backend, for script testing use the other one
    # f = "backend\\Los-Angeles-Music-Composer-MI-Seed-1.mid"

    # the other one
    f = "Los-Angeles-Music-Composer-MI-Seed-1.mid"

    score = TMIDIX.midi2single_track_ms_score(open(f, 'rb').read(), recalculate_channels=False)
else:
    pass
    # TODO, use a passed in file.
    # if list(uploaded_MIDI.keys()):
    #     score = TMIDIX.midi2single_track_ms_score(list(uploaded_MIDI.values())[0], recalculate_channels=False)
    #     f = list(uploaded_MIDI.keys())[0]
    # else:
    #     f = ''

if f != '':

    print('File:', f)

    # =======================================================
    # START PROCESSING

    # INSTRUMENTS CONVERSION CYCLE
    events_matrix = []
    melody_chords_f = []
    melody_chords_f1 = []

    itrack = 1

    patches = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    patch_map = [
                            [0, 1, 2, 3, 4, 5, 6, 7],  # Piano
                            [24, 25, 26, 27, 28, 29, 30],  # Guitar
                            [32, 33, 34, 35, 36, 37, 38, 39],  # Bass
                            [40, 41],  # Violin
                            [42, 43],  # Cello
                            [46],  # Harp
                            [56, 57, 58, 59, 60],  # Trumpet
                            [64, 65, 66, 67, 68, 69, 70, 71],  # Sax
                            [72, 73, 74, 75, 76, 77, 78],  # Flute
                            [-1],  # Drums
                            [52, 53],  # Choir
                            [16, 17, 18, 19, 20]  # Organ
                            ]

    while itrack < len(score):
        for event in score[itrack]:
            if event[0] == 'note' or event[0] == 'patch_change':
                events_matrix.append(event)
        itrack += 1

    events_matrix.sort(key=lambda x: x[1])

    events_matrix1 = []

    for event in events_matrix:
        if event[0] == 'patch_change':
            patches[event[2]] = event[3]

        if event[0] == 'note':
            event.extend([patches[event[3]]])
            once = False

            for p in patch_map:
                if event[6] in p and event[3] != 9:  # Except the drums
                    event[3] = patch_map.index(p)
                    once = True

            if not once and event[3] != 9:  # Except the drums
                event[3] = 15  # All other instruments/patches channel
                event[5] = max(80, event[5])

            if event[3] < 12:  # We won't write chans 12-16 for now...
                events_matrix1.append(event)

    # =======================================================
    # PRE-PROCESSING

    # checking number of instruments in a composition
    instruments_list_without_drums = list(set([y[3] for y in events_matrix1 if y[3] != 9]))

    if len(events_matrix1) > 0 and len(instruments_list_without_drums) > 0:

        # recalculating timings
        for e in events_matrix1:
            e[1] = int(e[1] / 10)  # Max 1 seconds for start-times
            e[2] = int(e[2] / 20)  # Max 2 seconds for durations

        # Sorting by pitch, then by start-time
        events_matrix1.sort(key=lambda x: x[4], reverse=True)
        events_matrix1.sort(key=lambda x: x[1])

        # =======================================================
        # FINAL PRE-PROCESSING

        melody_chords = []

        pe = events_matrix1[0]

        for e in events_matrix1:
            if e[1] >= 0 and e[2] >= 0:

                # Clipping all values...
                tim = max(0, min(127, e[1]-pe[1]))
                dur = max(1, min(127, e[2]))
                cha = max(0, min(11, e[3]))
                ptc = max(1, min(127, e[4]))
                vel = max(8, min(127, e[5]))

                velocity = round(vel / 15)

                # Writing final note
                melody_chords.append([tim, dur, cha, ptc, velocity])

                pe = e

    instruments_list = list(set([y[2] for y in melody_chords]))
    num_instr = len(instruments_list)

    # =======================================================
    # FINAL PROCESSING
    # =======================================================

    # Break between compositions / Intro seq

    if 9 in instruments_list:
        drums_present = 2818  # Yes
    else:
        drums_present = 2817  # No

    melody_chords_f.extend([2816, drums_present, 2819+(num_instr-1)])

    # =======================================================

    # Composition control seq
    intro_mode_time = statistics.mode([0] + [y[0] for y in melody_chords if y[2] != 9 and y[0] != 0])
    intro_mode_dur = statistics.mode([y[1] for y in melody_chords if y[2] != 9])
    intro_mode_pitch = statistics.mode([y[3] for y in melody_chords if y[2] != 9])
    intro_mode_velocity = statistics.mode([y[4] for y in melody_chords if y[2] != 9])

    # Instrument value 12 is reserved for composition control seq
    intro_dur_vel = (intro_mode_dur * 8) + (intro_mode_velocity-1)
    intro_cha_ptc = (12 * 128) + intro_mode_pitch

    melody_chords_f.extend([intro_mode_time, intro_dur_vel+128, intro_cha_ptc+1152])

    # TOTAL DICTIONARY SIZE 2831

    # =======================================================
    # MAIN PROCESSING CYCLE
    # =======================================================

    for m in melody_chords:

        # WRITING EACH NOTE HERE
        dur_vel = (m[1] * 8) + (m[4]-1)
        cha_ptc = (m[2] * 128) + m[3]

        melody_chords_f.extend([m[0], dur_vel+128, cha_ptc+1152])
        melody_chords_f1.append([m[0], dur_vel+128, cha_ptc+1152])

    # =======================================================

    song = melody_chords_f
    song_f = []
    tim = 0
    dur = 0
    vel = 0
    pitch = 0
    channel = 0

    son = []
    song1 = []

    for s in song:
        if 128 <= s < (12 * 128)+1152:
            son.append(s)
        else:
            if len(son) == 3:
                song1.append(son)
            son = [s]

    for ss in song1:

        tim += ss[0] * 10

        dur = ((ss[1]-128) // 8) * 20
        vel = (((ss[1]-128) % 8)+1) * 15

        channel = (ss[2]-1152) // 128
        pitch = (ss[2]-1152) % 128

        song_f.append(['note', tim, dur, channel, pitch, vel])

    detailed_stats = TMIDIX.Tegridy_ms_SONG_to_MIDI_Converter(
        song_f,
        output_signature='Los Angeles Music Composer',
        output_file_name='output\\Los-Angeles-Music-Composer-Seed-Composition',
        track_name='Project Los Angeles',
        list_of_MIDI_patches=[0, 24, 32, 40, 42, 46, 56, 71, 73, 0, 53, 19, 0, 0, 0, 0]
    )

    # =======================================================

    print('Composition stats:')
    print('Composition has', len(melody_chords_f1), 'notes')
    print('Composition has', len(melody_chords_f), 'tokens')

    print('Displaying resulting composition...')

    file_name = 'output\\Los-Angeles-Music-Composer-Seed-Composition'

    x = []
    y = []
    c = []

    colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'pink', 'orange', 'purple', 'gray', 'white', 'gold', 'silver']

    for s in song_f:
        x.append(s[1] / 1000)
        y.append(s[4])
        c.append(colors[s[3]])

    if render_MIDI_to_audio:
        synth = FluidSynth("/usr/share/sounds/sf2/FluidR3_GM.sf2", 16000)
        synth.midi_to_audio(str(file_name + '.mid'), str(file_name + '.wav'))       # what's going on here?
        # display(Audio(str(file_name + '.wav'), rate=16000))       # Ipython stuff, collab stuff.

    plt.figure(figsize=(14, 5))
    ax = plt.axes(title=file_name)
    ax.set_facecolor('black')

    plt.scatter(x, y, c=c)
    plt.xlabel("Time")
    plt.ylabel("Pitch")
    plt.show()
