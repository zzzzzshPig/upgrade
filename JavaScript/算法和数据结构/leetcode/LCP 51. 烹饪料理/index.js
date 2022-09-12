/**
 * @param {number[]} materials
 * @param {number[][]} cookbooks
 * @param {number[][]} attribute
 * @param {number} limit
 * @return {number}
 */
var perfectMenu = function(materials, cookbooks, attribute, limit) {
    // 记录最大美味值
    let res = -1;

    dfs(materials, 0, 0, limit);

    function dfs(_mats, index, x, _lim) {
        // 更新美味值
        if (_lim <= 0) res = Math.max(x, res);

        for (let i = index; i < cookbooks.length; i++) {
            const cookbook = cookbooks[i];
            let has = true;
            let mats = [];

            for (let j = 0; j < _mats.length; j++) {
                if (_mats[j] - cookbook[j] < 0) {
                    has = false;
                    break;
                }
                mats.push(_mats[j] - cookbook[j]);
            }

            // 食材不充足
            if (!has) {
                continue;
            }

            // 充足则继续递归
            dfs(mats, i + 1, x + attribute[i][0], limit - attribute[i][1]);
        }
    }

    return res;
};
