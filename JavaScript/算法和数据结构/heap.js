function upHeap (heap) {
    let i = heap.length - 1
    let j = Math.floor((i - 1) / 2) // 父级

    while (j >= 0) {
        if (heap[i] < heap[j]) {
            [heap[i], heap[j]] = [heap[j], heap[i]]
        } else {
            break
        }

        i = j
        j = Math.floor((i - 1) / 2) // 父级
    }
}

function downHeap (heap) {
    let i = 0
    let j = i * 2 + 1 // 子级

    // 和最小的互换
    while (j < heap.length) {
        if (heap[j] > heap[j + 1]) {
            j = j + 1
        }

        if (heap[i] > heap[j]) {
            [heap[i], heap[j]] = [heap[j], heap[i]]

            i = j
            j = i * 2 + 1 // 子级
        } else {
            break
        }
    }
}

/*
* 题目描述：在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
示例 1:
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5

示例 2: 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4

说明:
你可以假设 k 总是有效的，且 1 ≤ k ≤ 数组的长度。
* */

function findKthLargest (nums, k) {
    const heap = []
    // 当前循环到的 最大的k个的 最小的始终在上面即可

    let i = 0
    for (i; i < k; i++) {
        heap[i] = nums[i]
        upHeap(heap)
    }

    for (i; i < nums.length; i++) {
        if (nums[i] > heap[0]) {
            heap[0] = nums[i]
            downHeap(heap)
        }
    }

    return heap[0]
}
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 3))
