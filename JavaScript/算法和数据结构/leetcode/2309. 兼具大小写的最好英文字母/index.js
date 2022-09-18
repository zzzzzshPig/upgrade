/**
 * @param {string} s
 * @return {string}
 */
var greatestLetter = function(s) {
    let m = [];

    for (let i = 0; i < s.length; i++) {
        const a = 90 - s[i].toUpperCase().charCodeAt(0);

        if (!m[a]) {
            m[a] = s[i];
        } else if (m[a] !== true) {
            m[a] = m[a] !== s[i]
        }
    }

    for (let i = 0; i < m.length; i++) {
        if (m[i] === true) return String.fromCharCode(90 - i).toUpperCase();
    }

    return '';
};
