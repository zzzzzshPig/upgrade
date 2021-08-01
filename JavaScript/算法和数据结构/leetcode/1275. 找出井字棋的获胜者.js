/**
 * @param {number[][]} moves
 * @return {string}
 */
var tictactoe = function(moves) {
    let arr = [['', '', ''], ['', '', ''], ['', '', '']]

    for (let i = 0; i < moves. length; i++) {
        let x = moves[i][0]
        let y = moves[i][1]

        arr[x][y] = i % 2 === 0 ? 'X' : 'O'
    }

    for (let x = 0; x < arr.length; x++) {
        for (let y = 0; y < arr[x].length; y++) {
            let item = arr[x][y]
            let a = arr[x - 1] && arr[x - 1][y]
            let b = arr[x - 1] && arr[x - 1][y - 1]
            let c = arr[x - 1] && arr[x - 1][y + 1]
            let d = arr[x + 1] && arr[x + 1][y]
            let e = arr[x + 1] && arr[x + 1][y - 1]
            let f = arr[x + 1] && arr[x + 1][y + 1]
            let g = arr[x][y - 1]
            let h = arr[x][y + 1]

            if (item && ([b, f].every(a => a === item) || [a, d].every(a => a === item) || [c, e].every(a => a === item) || [g, h].every(a => a === item))) {
                // win
                return item === 'X' ? 'A' : 'B'
            }
        }
    }

    return moves.length === 9 ? 'Draw' : 'Pending'
};
console.log(tictactoe([[1, 1]]))
