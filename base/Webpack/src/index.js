import './index.less'
import './index.jpg'

const test = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('你猜呀')
    }, 2000)
})

test.then(a => {
    console.log(a)
})
