/**
 * @param {number[][]} rectangles
 * @return {number}
 */
var countGoodRectangles = function(rectangles) {
    const rule = {}
    let max = 0

    rectangles.forEach(a => {
        a = Math.min(...a)

        rule[a] = (rule[a] + 1) || 1

        max = Math.max(max, a)
    })

    return rule[max]
};
