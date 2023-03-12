# int 字符串必须为整数
print(int('123'))  # 123

# float 转浮点数
print(float('123'))  # 123.0

# complex 转复数
print(complex(1, 2))  # (1+2j)

# str 转字符串
print(str(123.122))  # 123.122

# repr 转表达式字符串
print(repr({'a': 1, 'b': {'c': [1, 2, 3], 'd': {1, 2, 3}, 'e': (1, 2, 3)}}))

# eval 执行代码
print(eval("1+2"))

# tuple 转元祖
print(tuple('123'), tuple([1, 2, 3]), tuple(
    {1, 2, 3}), tuple({'a': 1, 'b': 2, 'c': 3}))

# list 转列表
print(list('123'), list((1, 2, 3)), list(
    {1, 2, 3}), list({'a': 1, 'b': 2, 'c': 3}))

# set 转集合
print(set('123'), set((1, 2, 3)), set(
    [1, 2, 3]), set({'a': 1, 'b': 2, 'c': 3}))

# dict 转字典
print(dict(a=1, b=2, c=3), dict([('a', 1), ('b', 2), ('c', 3)], d=4))

# frozenset 冻结集合
print(frozenset([1, 2, 3]), frozenset((1, 2, 3)),
      frozenset({1, 2, 3}), frozenset('123'))

# chr Ascii | unicode 转字符
print(chr(97))

# ord 取字符 Ascii | unicode 表示
print(ord('a'))

# hex 转16进制数
print(hex(97))

# oct 转8进制数
print(oct(72))
