from pathlib import Path as path
import json

with open(path(__file__).with_name('test.json'), 'r') as testJsonFile:
    testJson = json.load(testJsonFile)

print(testJson, type(testJson))
