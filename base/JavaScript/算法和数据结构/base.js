// queue
const queue = []
console.log(
    '队列，先入先出\n',
    queue.push(1),
    queue.push(2),
    queue.push(3),
    queue.push(4),
    queue.shift(),
    queue.shift(),
    queue.shift(),
    queue.shift()
)

// stack
const stack = []
console.log(
    '栈，后入先出\n',
    stack.push(1),
    stack.push(2),
    stack.push(3),
    stack.push(4),
    stack.pop(),
    stack.pop(),
    stack.pop(),
    stack.pop()
)

// 链表
function * linkNode () {
    yield 1
    yield 2
    yield 3
    yield 4
}

const l = linkNode()
console.log(
    '链表\n',
    l.next().value,
    l.next().value,
    l.next().value,
    l.next().value
)

// 二叉树
function treeNode (value) {
    return {
        value,
        left: null,
        right: null
    }
}
const node = treeNode(1)

let nodes = [node.left = treeNode(2), node.right = treeNode(2)]
for (let i = 3; i < 5; i++) {
    const n = []
    for (let j = 0; j < nodes.length; j++) {
        n.push(nodes[j].left = treeNode(i), nodes[j].right = treeNode(i))
    }
    nodes = n
}
console.log(
    '二叉树\n',
    node
)
