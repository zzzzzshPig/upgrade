# 生成器是迭代函数的行为
def pf(start: float | int, n: int):
    for _ in range(0, n):
        start *= start
        yield start


p = pf(2, 5)

for i in p:
    print(i)
