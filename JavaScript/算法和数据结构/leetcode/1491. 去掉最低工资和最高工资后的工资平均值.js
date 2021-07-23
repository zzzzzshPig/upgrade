/**
 * @param {number[]} salary
 * @return {number}
 */
var average = function(salary) {
    let max = salary[0]
    let min = salary[0]
    let res = 0

    for (let i = 0; i < salary.length; i++) {
        if (salary[i] > max) {
            max = salary[i]
        } else if (salary[i] < min) {
            min = salary[i]
        }

        res += salary[i]
    }

    return (res - max - min) / (salary.length - 2)
};
