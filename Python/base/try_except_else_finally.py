import random

try:
    r = random.random()
    rs = f'value is {r}'

    if (r > 0.9):
        raise ValueError(rs)
    elif (r > 0.7):
        raise TabError(rs)
    elif (r > 0.5):
        raise KeyError(rs)
except (ValueError, TabError) as e:
    print(f'value, tab error {repr(e)}')
except Exception as e:
    print(f'other error {repr(e)}')
else:
    print(f'no error {r}')
finally:
    print('done')
