// 两数求和问题
/*
真题描述： 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

示例: 给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9 所以返回 [0, 1]
* */
// function twoSum (nums, target) {
//     const map = {}
//     for (let i = 0; i < nums.length; i++) {
//         const m = map[target - nums[i]]
//         if (m !== undefined) {
//             return [m, i]
//         } else {
//             map[nums[i]] = i
//         }
//     }
// }
// console.log(twoSum([2, 7, 11, 15], 22))

// 合并两个有序数组
/*
* 真题描述：给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
说明: 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

示例: 输入:
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6], n = 3
输出: [1,2,2,3,5,6]
* */
// function merge (nums1, m, nums2, n) {
//     let len = nums1.length - 1
//
//     while (n > 0) {
//         if (nums1[m - 1] > nums2[n - 1]) {
//             nums1[len--] = nums1[--m]
//         } else {
//             nums1[len--] = nums2[--n]
//         }
//     }
//
//     return nums1
// }
// console.log(merge([1, 2, 3, 0, 0, 0], 3, [0, 0, 0], 3))

// 三数求和问题
/*
* 真题描述：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
注意：答案中不可以包含重复的三元组。

示例： 给定数组 nums = [-1, 0, 0, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]
* [-4,-1,-1,0,1,2]
* */
// function threeSum (nums) {
//     nums.sort((a, b) => a - b)
//
//     let l = 1
//     let r = nums.length - 1
//     let i = 0
//     const res = new Set()
//
//     while (nums[i] <= 0 && i < nums.length - 2) {
//         const sum = nums[l] + nums[r] + nums[i]
//
//         if (sum > 0) {
//             r--
//         } else if (sum < 0) {
//             l++
//         } else {
//             res.add([nums[i], nums[l], nums[r]].toString())
//             l = r
//         }
//
//         if (l === r) {
//             i++
//             l = i + 1
//             r = nums.length - 1
//         }
//     }
//
//     return Array.from(res.values()).map(a => a.split(',').map(b => +b))
// }
// console.log(threeSum([-1, 0, 1, 2, -1, -4]))
