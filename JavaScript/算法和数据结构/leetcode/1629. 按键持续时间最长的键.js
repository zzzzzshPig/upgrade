/**
 * @param {number[]} releaseTimes
 * @param {string} keysPressed
 * @return {character}
 */
var slowestKey = function(releaseTimes, keysPressed) {
    let duration = 0
    let key = 'a'

    keysPressed = ' ' + keysPressed
    releaseTimes.unshift(0)

    for (let i = 1; i < releaseTimes.length; i++) {
        let time = releaseTimes[i] - releaseTimes[i - 1]

        if (time > duration || (time === duration && keysPressed[i] > key)) {
            key = keysPressed[i]
            duration = time
        }
    }

    return key
};
