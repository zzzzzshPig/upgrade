/*
* list type are array
* */
function iteratorGenerator (list) {
    let i = 0

    return {
        done: false,
        next () {
            this.done = list.length <= i

            let res = undefined
            if (!this.done) {
                res = list[i]
                i++
            }

            return {
                done: this.done,
                res
            }
        }
    }
}

const list = [1, 2, 3]
const iterator = iteratorGenerator(list)
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
list.push(4)
console.log(iterator.next())
list.push(5)
list.push(6)
list.push(7)
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
