/**
 * @param {string[][]} paths
 * @return {string}
 */
var destCity = function(paths) {
    let start = {}
    let end = {}

    paths.forEach(a => {
        start[a[0]] = 1
        end[a[1]] = 1
    })

    for (const key in end) {
        if (!start[key]) {
            return key
        }
    }
};
console.log(destCity([["London","New York"],["New York","Lima"],["Lima","Sao Paulo"]]))
