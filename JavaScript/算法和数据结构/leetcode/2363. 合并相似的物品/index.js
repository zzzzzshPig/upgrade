/**
 * @param {number[][]} items1
 * @param {number[][]} items2
 * @return {number[][]}
 */
var mergeSimilarItems = function(items1, items2) {
    let m = {};

    items1.forEach(item => m[item[0]] = m[item[0]] + item[1] || item[1]);
    items2.forEach(item => m[item[0]] = m[item[0]] + item[1] || item[1]);

    return Object.entries(m);
};
