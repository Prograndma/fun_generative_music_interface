# pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
import torch

device = torch.device(0)
tense = torch.Tensor([0, 1]).to(device)
print(device)
print(tense) 

# If your output looks like this:
# cuda:0
# tensor([0., 1.], device='cuda:0') 
# then congrats!
