/**
 * @param {string} coordinates
 * @return {boolean}
 */
var squareIsWhite = function(coordinates) {
    return ('bdfh'.includes(coordinates[0]) && '1357'.includes(coordinates[1])) ||
        ('aceg'.includes(coordinates[0]) && '2468'.includes(coordinates[1]))
};
