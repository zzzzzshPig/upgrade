for x in range(3):
    print(x)
    break  # break 后不会进入else
else:
    print('for done')

a = 0
while a < 3:
    print(a)
    a += 1

    if (a == 2):
        break  # break 后不会进入else
else:
    print('while done')
