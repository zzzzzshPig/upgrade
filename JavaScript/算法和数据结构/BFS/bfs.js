// 111. 二叉树的最小深度
var minDepth = function(root) {
    if (!root) return 0

    let res = 1
    const bfs = [root]

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            // 结束条件
            if (!cur.left && !cur.right) return res

            cur.left && bfs.push(cur.left)
            cur.right && bfs.push(cur.right)
        }

        res++
    }
}

// 752. 打开转盘锁
var openLock = function(deadends, target) {
    const visited = ['0000']
    const bfs = ['0000']
    let res = 0

    function move (str, idx, dir) {
        const s = str[idx]
        const up = s === '0' ? '9' : (Number(s) - 1).toString()
        const down = s === '9' ? '0' : (Number(s) + 1).toString()
        return `${str.slice(0, idx)}${dir === -1 ? up : down}${str.slice(idx + 1)}`
    }

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            // 死锁 跳过
            if (deadends.includes(cur)) continue

            // 找到target 结束
            if (target === cur) return res

            for (let j = 0; j < 4; j++) {
                const up = move(cur, j, -1)
                if (!visited.includes(up)) {
                    bfs.push(up)
                    visited.push(up)
                }

                const down = move(cur, j, 1)
                if (!visited.includes(down)) {
                    bfs.push(down)
                    visited.push(down)
                }
            }
        }

        res++
    }

    return -1
};
// console.log(openLock(["8767","7868","6886","8686","6788","6877","6778","8678","7766","6878","8668","6688","7668","7886","6778","6778","6868","7888","8677","6678","8666","6887","8866","8666","6776","6777","7688","6677","7688","7676","6788","6866","6676","8676","7687","6867","8676","6767","6788","6666","7888","8767","7767","6886","6787","7766","6788","8677","7766","6786","7788","8667","8667","8678","7887","8887","6787","8867","8787","6868","7687","7668","8686","8776","8667","8788","7878","7866","6668","6687","8888","8776","6787","7767","8687","7688","8788","8888","6786","8668","8778","8876","8686","8878","6788","8688","6766","8766","8666","6768","7777","7866","8778","7887","6777","6677","6666","8878","6668","6666","6678","7888","6667","7667","7787","6876","6887","6678","7788","6867","7786","8888","7777","8877","7877","6767","7767","6867","6888","6678","6776","6668","7678","6688","8878","6787","7668","7667","6688","7876","8787","8776","6767","7866","7767","6666","8887","8686","7677","6687","6878","6866","7786","6778","8866","6687","6876","8668","8768","8768","7876","7778","8876","8887","8866","7778","6887","7767","6778","6688","8886","6787","8887","8687","7777","8866","6677","6868","8867","6876","7867","7868","8667","7867","7876","6688","6666","7677","6677","8676","7878","6868","8677","7786","7668","6677","7867","6677","7867","8878","8867","6767","6867","8877","8776","7767","6687","6788","8868","8767","7687","6678","7876","6786","6767","7778","7786","6876","7668","7678","8876","6868","7776","7687","7686","8876","8886","6666","7877","8776","8867","6676","6887","8888","6776","7787","8687","6668","8687","7667","6867","7788","7876","6768","7876","7678","6668","6788","8866","6687","6667","6888","7688","6676","7688","8768","8888","6686","7868","6787","7876","7668","6786","6888","8866","6886","6667","8767","7786","8887","7767","7867","7677","6867","6887","8778","6666","6887","8678","7767","8677","6777","8667","7878","6878","8867","6678","6866","8887","8788","8668","6887","7767","7777","7888","8877","8768","6767","7868","7668","6687","7766","7886","7877","7686","6678","7677","6886","6877","6667","8887","6686","7777","6776","7776","7878","7677","8677","8766","8686","8778","8777","8766","6777","8868","7886","8888","7666","8787","6687","8667","8668","8868","8867","6788","6677","6787","8868","6778","6788","7688","8678","6688","6678","8888","8866","8767","8676","7688","6877","8768","7868","6868","8686","7877","7767","6688","8787","8778","8887","7878","6768","8878","6766","8688","7868","6766","8776","7866","7678","7786","8768","6867","6678","6886","6677","6888","7667","6787","8767","6878","7786","7688","8687","6777","8687","7887","7686","8767","6876","7867","8676","8787","6788","8787","8878","6886","7766","6876","7767","8666","7766","7787","7667","7878","7668","6876","6676","7887","8678","6788","8888","6887","8866","6668","8877","8768","8776","8676","7688","6776","6887","6766","7788","8677","7677","8688","8868","8866","6776","6788","6786","6768","6767","6878","8887","7778","8687","6666","6666","8767","8878","6878","8688","6677","7686","8677","8676","8878","6886","6766","6787","6788","7786","6688","8766","8667","8777","7887","6786","6768","7667","8877","8668","8667","8768","6866","7778","8767","8768","8688","8877","7867","6866","7766","8888","6687","6688","7876","8867","7686","6877","6768","8776","6677","7776","6678","6676","8777","6668","6766","8777","7867","7788","7678","6876","7878","8876","8767","7676","8777","8887","8787","7676","6688","8768","8668","8667","7668","6678"], "7768"))

// 690. 员工的重要性
// 不存在一个员工对应多个领导的情况，所以不需要记录访问过的员工
var GetImportance = function(employees, id) {
    const bfs = [id]
    let res = 0

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            for (let j = 0; j < employees.length; j++) {
                const employee = employees[j]

                if (employee.id === cur) {
                    res += employee.importance
                    bfs.push(...employee.subordinates)
                    break
                }
            }
        }
    }

    return res
};
