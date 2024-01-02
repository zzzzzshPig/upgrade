import time
import random
from pathlib import Path as path

with open(path(__file__).with_name('typewriter.txt'), 'r') as f:
    fStr = f.read()
    for s in fStr:
        print(s, end='', flush=True)
        time.sleep(random.uniform(.05, .1))
