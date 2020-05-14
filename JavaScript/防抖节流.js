
// 防抖 在指定时间内连续触发会重置触发
function fangdou (ms) {
    let time = null

    // 无等待任务 则设置等待任务
    // 否则清空等待任务 重置值
    return function () {
        return new Promise((resolve, reject) => {
            if (time === null) {
                time = setTimeout(resolve, ms)
            } else {
                clearTimeout(time)
                time = null
                reject()
            }
        })
    }
}

const fangdouInstance = fangdou(1000)
setInterval(() => {
    fangdouInstance().then(() => {
        console.log('fangdouInstance')
    }).catch(() => {
        console.log('fangdouInstance interval')
    })
}, 500)

// 节流 在指定时间段只能触发一次
function jieliu (ms) {
    let ctime = 0

    return function () {
        return new Promise((resolve, reject) => {
            const now = Date.now()

            if (now - ctime >= ms) {
                resolve()
                ctime = now
            } else {
                reject()
            }
        })
    }
}

const jieliuInstance = jieliu(1000)

setInterval(() => {
    jieliuInstance().then(() => {
        console.log('jieliuInstance')
    }).catch(() => {
        console.log('jieliuInstance interval')
    })
}, 500)
