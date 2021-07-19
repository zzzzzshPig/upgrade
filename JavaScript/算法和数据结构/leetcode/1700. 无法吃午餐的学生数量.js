/**
 * @param {number[]} students
 * @param {number[]} sandwiches
 * @return {number}
 */
var countStudents = function(students, sandwiches) {
    let one = 0
    let zero = 0

    for (let i = 0; i < students.length; i++) {
        if (students[i] === 1) {
            one++
        } else {
            zero++
        }
    }

    for (let i = 0; i < sandwiches.length; i++) {
        if (sandwiches[i] === 0 && zero === 0) break
        if (sandwiches[i] === 1 && one === 0) break

        if (sandwiches[i] === 1) {
            one--
        } else {
            zero--
        }
    }

    return one + zero
};
