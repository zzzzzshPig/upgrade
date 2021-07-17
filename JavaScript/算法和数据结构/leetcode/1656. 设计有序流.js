/**
 * @param {number} n
 */
var OrderedStream = function(n) {
    this.arr = []
    this.ptr = 1
};

/**
 * @param {number} idKey
 * @param {string} value
 * @return {string[]}
 */
OrderedStream.prototype.insert = function(idKey, value) {
    // arr中绝对不会存在id是idKey的项，所以只有当idKey = ptr才需要更新ptr
    this.arr[idKey] = [idKey, value]
    const res = []

    if (idKey === this.ptr) {
        while (this.arr[this.ptr]) {
            res.push(this.arr[this.ptr][1])
            this.ptr++
        }
    }

    return res
};

/**
 * Your OrderedStream object will be instantiated and called as such:
 * var obj = new OrderedStream(n)
 * var param_1 = obj.insert(idKey,value)
 */
const os = new OrderedStream(5);
os.insert(3, "ccccc"); // 插入 (3, "ccccc")，返回 []
os.insert(1, "aaaaa"); // 插入 (1, "aaaaa")，返回 ["aaaaa"]
os.insert(2, "bbbbb"); // 插入 (2, "bbbbb")，返回 ["bbbbb", "ccccc"]
os.insert(5, "eeeee"); // 插入 (5, "eeeee")，返回 []
os.insert(4, "ddddd"); // 插入 (4, "ddddd")，返回 ["ddddd", "eeeee"]
