/**
 * @param {number[][]} grid
 * @return {number[][]}
 */
var largestLocal = function(grid) {
    const len = grid.length;

    for (let i = len - 1; i >= 0; i--) {
        for (let j = len - 1; j >= 2; j--) {
            grid[i][j] = Math.max(grid[i][j - 2], grid[i][j - 1], grid[i][j]);
        }

        grid[i].shift();
        grid[i].shift();

        if (i <= len - 3) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i + 2][j] = Math.max(grid[i][j], grid[i + 1][j], grid[i + 2][j])
            }
        }
    }

    grid.shift();
    grid.shift();

    // 最后返回数组
    return grid;
};
console.log(largestLocal([[9,9,8,1],[5,6,2,6],[8,2,6,4],[6,2,2,2]]))
