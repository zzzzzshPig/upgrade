import numpy as np
import time


# 使用循环计算平均值
def loop_mean(arr):
    sum = 0
    for i in range(len(arr)):
        sum += arr[i]
    return sum / len(arr)


# 使用向量化运算计算平均值
def vector_mean(arr):
    return np.mean(arr)


# 生成长度为10万的随机数组
start_time = time.time()
arr = np.random.normal(size=10000000)
end_time = time.time()

# 测试循环运算的时间和空间消耗
# start_time = time.time()
# loop_mean(arr)
# end_time = time.time()
# print("Loop time:", end_time - start_time)

# 测试向量化运算的时间和空间消耗
start_time = time.time()
vector_mean(arr)
end_time = time.time()
print("Vector time:", end_time - start_time)
