// https://labuladong.gitbook.io/algo/di-ling-zhang-bi-du-xi-lie-qing-an-shun-xu-yue-du/hua-dong-chuang-kou-ji-qiao-jin-jie

//1004. 最大连续1的个数 III
var longestOnes = function(A, K) {
    let r = 0
    let l = 0
    let res = 0

    while (r < A.length) {
        const c = A[r]
        r++

        if (c !== 1) K--

        if (K < 0) {
            const d = A[l]
            l++

            res = Math.max(res, r - l)

            K = 0
            if (d === 0) K++

            r--
        }
    }

    return Math.max(res, r - l)
}
