/**
 * @param {string[]} emails
 * @return {number}
 */
var numUniqueEmails = function(emails) {
    let s = new Set()

    emails.forEach(a => {
        let hasPlus = false
        let r = ''

        for (let i = 0; i < a.length; i++) {
            if (a[i] === '@') {
                r += a.slice(i)
                break
            } else if (hasPlus || a[i] === '.') {
            } else if (a[i] === '+') {
                hasPlus = true
            } else {
                r += a[i]
            }
        }

        s.add(r)
    })

    return s.size
};
console.log(numUniqueEmails(["test.email+alex@leetcode.com", "test.email@leetcode.com"]))
