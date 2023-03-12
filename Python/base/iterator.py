
# 迭代器
list = iter([1, 2, 3, 4])

for l in list:
    print(l, end=" ")

print('')


class MyIter:
    # 创建迭代器
    def __init__(self) -> None:
        self.a = 0

    def __iter__(self):
        return self

    def __next__(self):
        self.a += 1

        if (self.a < 20):
            return self.a

        raise StopIteration


myIter = MyIter()

try:
    while (True):
        print(next(myIter))
except StopIteration:
    print('done')
