class TreeNode {
    constructor (val) {
        this.val = val
        this.left = this.right = null
    }
}

function isUndef (val) {
    return val === undefined || val === null
}

function generateTree (nodes) {
    if (!nodes.length) return null

    const c = new TreeNode(nodes[0])
    let c1 = [c]

    let i = 0
    while (i < nodes.length && c1.length) {
        const len = c1.length
        const c2 = []
        for (let j = 0; j < len; j++) {
            i++
            c1[j].left = !isUndef(nodes[i]) ? new TreeNode(nodes[i]) : null
            i++
            c1[j].right = !isUndef(nodes[i]) ? new TreeNode(nodes[i]) : null

            c1[j].left && c2.push(c1[j].left)
            c1[j].right && c2.push(c1[j].right)
        }
        c1 = c2
    }
    return c
}

module.exports = {
    generateTree,
    TreeNode
}
