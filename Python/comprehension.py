list1 = ['lisa', 'pinzi', 'front', 'a', 'b', 'c']
list2 = [1, 2, 3]

# list 过滤掉长度小于或等于3的字符串列表，并将剩下的转换成大写字母：
print([r.upper() for r in list1 if len(r) > 3])

# list 计算 30 以内可以被 3 整除的整数：
print([r for r in range(30) if r % 3 == 0])

# tuple 生成一个包含数字 1~9 的元组
print((r for r in range(1, 10)))

# set 计算数字 1,2,3 的平方数：
print({r ** 2 for r in list2})

# set 判断不是 a,b,c 的字母并输出：
print({r for r in list1 if r not in 'abc'})

# dictionary 使用字符串及其长度创建字典：
print({r: len(r) for r in list1})

# dictionary 提供三个数字，以三个数字为键，三个数字的平方为值来创建字典：
print({r: r ** 2 for r in list2})
