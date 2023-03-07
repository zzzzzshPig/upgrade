import math
import random

# abs 绝对值
print(abs(-1 - 2))

# ceil 数字的上入整数
print(math.ceil(3.2), math.ceil(-3.2))

# exp 返回e的x次幂(ex)
print(math.exp(2))

# fabs 返回浮点型绝对值
print(math.fabs(-1 - 2))

# floor 数字的下舍整数
print(math.floor(3.2), math.floor(-3.2))

# log(x, y = math.e) 返回y为底x的对数
print(math.log(100, 10))

# log10(x) 返回10为底x的对数
print(math.log10(100))

# max 返回给定参数的最大值
print(max(random.random() for _ in range(3)))

# min 返回给定参数的最小值
print(min(random.random() for _ in range(3)))

# modf 返回x的整数部分与小数部分 有精度问题
print(math.modf(1.2))

# pow 和 x ** y 一样
print(pow(2, 2))

# round(x) 浮点数 x 的四舍五入值 https://www.runoob.com/w3cnote/python-round-func-note.html
print(round(0.5))

# sqrt 返回平方根
print(math.sqrt(9))
