a = 1


def my_func():
    global a
    a = 2
    print("Inside my_func, a is", a)
    a = 3  # 创建一个新的局部变量a，与全局变量同名


my_func()

print("Outside my_func, a is", a)
