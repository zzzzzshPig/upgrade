/**
 * @param {string} rings
 * @return {number}
 */
var countPoints = function(rings) {
    let rods = Array.from({ length: 10 }).fill('');
    let res = 0;

    for (let i = 0; i < rings.length; i += 2) {
        const index = rings[i + 1];
        if (rods[index].includes(rings[i])) continue;
        rods[index] += rings[i];

        if (rods[index].length === 3) res++;
    }

    return res;
};
