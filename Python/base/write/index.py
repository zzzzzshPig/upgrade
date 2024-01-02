from pathlib import Path as path
import json

jsonContent = json.dumps({
    'a': 1,
    'b': {
        'c': 2,
        'd': {
            'e': 3
        }
    }
}, indent=4)

with open(path(__file__).with_name('write.json'), 'w') as writeJson:
    writeJson.write(jsonContent)
