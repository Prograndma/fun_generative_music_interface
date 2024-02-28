import torch

device = torch.device(0)
tense = torch.Tensor([0, 1]).to(device)
print(device)

print(tense)