/**
 * @param {string[]} logs
 * @return {string[]}
 */
var reorderLogFiles = function(logs) {
    return logs.sort((a, b) => {
        let a1 = a.slice(a.indexOf(' ') + 1)
        let b1 = b.slice(b.indexOf(' ') + 1)
        let aIsAbc = a1[0] >= 'a'
        let bIsAbc = b1[0] >= 'a'

        if (aIsAbc && bIsAbc) {
            return a1 === b1 ? a.localeCompare(b) : a1.localeCompare(b1)
        }

        return aIsAbc ? -1 : bIsAbc ? 1 : 0
    })
};
console.log(reorderLogFiles(["a1 9 2 3 1","g1 act car","zo4 4 7","ab1 off key dog","a8 act zoo"]))
