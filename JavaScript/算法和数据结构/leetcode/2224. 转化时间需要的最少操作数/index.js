/**
 * @param {string} current
 * @param {string} correct
 * @return {number}
 */
var convertTime = function(current, correct) {
    const s = [1, 5, 15, 60];
    const _current = parseInt(current) * 60 + parseInt(current.slice(3));
    const _correct = parseInt(correct) * 60 + parseInt(correct.slice(3));
    let minute = _correct - _current;

    let res = 0;

    while(minute) {
        let s1 = s.pop();
        res += Math.floor(minute / s1);
        minute %= s1;
    }

    return res;
};
