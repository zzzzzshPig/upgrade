/**
 * @param {string} date
 * @return {string}
 */
var reformatDate = function(date) {
    const month = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}

    date = date.split(' ')

    let m = month[date[1]]
    let d = parseInt(date[0])

    return `${date[2]}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
};
