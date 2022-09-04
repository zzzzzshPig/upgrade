/**
 * @param {string} key
 * @param {string} message
 * @return {string}
 */
var decodeMessage = function(key, message) {
    let j = 0;
    let map = {
        " ": " ",
    };
    for (let i = 0; i < key.length; i++) {
        if (map[key[i]]) continue;
        map[key[i]] = String.fromCharCode(j + 97);
        j++;
    }

    let res = '';
    for (let i = 0; i < message.length; i++) {
        res += map[message[i]];
    }

    return res;
};
console.log(decodeMessage("the quick brown fox jumps over the lazy dog",
"vkbs bs t suepuv"))
