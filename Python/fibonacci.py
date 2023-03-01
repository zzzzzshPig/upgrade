'''
比较慢的写法
def fibonacci(n: int):
    if n == 0:
        return 0
    if n == 1:
        return 1

    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(40))
'''

a, b = 0, 1
for _ in range(100):
    a, b = b, a + b

print(a)
