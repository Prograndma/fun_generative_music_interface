
import torch

# pip install miditok==2.1.8 VERY IMPORTANT
from miditok import REMI

from transformers import GPT2LMHeadModel
from miditoolkit import MidiFile

class MidiGenerator():
    def __init__(self):
        self.tokenizer = REMI(params = "GPT2Piano\\Tokenizer\\tokenizer.conf")
        self.model = GPT2LMHeadModel.from_pretrained("Qilex/GPT2Piano")
        self.device = torch.device(0)
        self.model.to(self.device)

    def condition_on_existing(self, midi_file):
        mid = MidiFile(midi_file, clip=True)
        # print(mid)
        tokens = self.tokenizer(mid)
        prompt = torch.tensor(tokens, dtype=torch.int64).to(self.device)
        continuation = self.model.generate(prompt, max_new_tokens=512,
                                           num_beams=1,
                                           do_sample=True,
                                           temperature=1.1,
                                           top_k=75,
                                           top_p=0.9,
                                           pad_token_id=self.tokenizer['PAD_None'])
        midi_result = self.tokenizer(continuation.cpu())
        midi_result.dump('continuation.mid')
        return "continuation.mid"

# device = torch.device(0)
# model.to(device)
# result = model.generate( max_new_tokens=512,
#     num_beams=1,
#     do_sample=True,
#     temperature=1.1,
#     top_k=75,
#     top_p=0.9,
#     pad_token_id= tokenizer['PAD_None'])
# converted_back_midi = tokenizer(result.cpu())
# converted_back_midi.dump('generation.midi')
# mf = MIDIFile("generation.midi")
# mf.writeFile("out.midi")