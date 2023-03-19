import numpy

arr1 = numpy.linspace(0, 10, 10)

arr2 = numpy.array([2.5, 6.5, 9.5])

print(arr1, numpy.searchsorted(arr1, arr2))
