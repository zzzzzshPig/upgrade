/**
 * @param {number[][]} grid
 * @return {boolean}
 */
var checkXMatrix = function(grid) {
    let len = grid.length;
    let len1 = len - 1;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            // 对角线
            if (j === i || j === len1 - i) {
                if (grid[i][j] === 0) return false
            } else if (grid[i][j] !== 0) return false
        }
    }

    return true;
};
