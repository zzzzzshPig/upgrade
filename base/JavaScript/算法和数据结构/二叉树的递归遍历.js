const root = {
    val: 'A',
    left: {
        val: 'B',
        left: {
            val: 'D'
        },
        right: {
            val: 'E'
        }
    },
    right: {
        val: 'C',
        right: {
            val: 'F'
        }
    }
}
// 先序遍历
// function eachTreeNode (node) {
//     if (!node) return
//
//     console.log(`当前value：${node.val}`)
//
//     eachTreeNode(node.left)
//
//     eachTreeNode(node.right)
// }

// 中序遍历
// function eachTreeNode (node) {
//     if (!node) return
//
//     eachTreeNode(node.left)
//
//     console.log(`当前value：${node.val}`)
//
//     eachTreeNode(node.right)
// }

// 后序遍历
function eachTreeNode (node) {
    if (!node) return

    eachTreeNode(node.left)
    eachTreeNode(node.right)

    console.log(`当前value：${node.val}`)
}

eachTreeNode(root)
