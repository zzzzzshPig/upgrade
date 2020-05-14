class Filter {
    items = []

    add (options) {
        const item = this.items.find(a => a.id === options.id)

        if (options.isOnly && item) {
            console.log('这个filter条件已经存在')
            this.setItemValue(item, options)
            return
        }

        console.log('新增filter条件')
        this.items.push({})
        this.setItemValue(this.items[this.items.length - 1], options)
    }

    setItemValue (item, options) {
        item.id = options.id
        item.text = options.text
        item.value = options.value

        // 通知订阅
        this.emitObserve()
    }

    install (filterChildren) {
        filterChildren.forEach(a => {
            // watch values changes
            a.option = new Proxy(a.option, {
                set: (target, p, v) => {
                    target[p] = v
                    this.add(target)
                }
            })
        })
    }

    print () {
        this.items.forEach(a => {
            console.log(a.text)
        })
    }

    // 通知
    observe = []
    addObserve (fn) {
        this.observe.push(fn)
    }

    emitObserve () {
        for (const o of this.observe) {
            o(this.items)
        }
    }
}

let ids = 0

class Filter1 {
    constructor () {
        this.option = {
            id: ids++,
            value: 1,
            text: '成交金额：1',
            isOnly: true
        }
    }
}

class Filter2 {
    constructor () {
        this.option = {
            id: ids++,
            value: 1,
            text: '所属部门：产品部',
            isOnly: false
        }
    }
}

const filterComponent = new Filter()
const filterChild1 = new Filter1()
const filterChild2 = new Filter2()

filterComponent.install([filterChild1, filterChild2])
filterComponent.addObserve((items) => {
    const values = items.map(a => a.value)

    console.log(`values: ${values}`)
})

filterChild1.option.value = 1
filterChild1.option.value = 2

filterChild2.option.value = 4
filterChild2.option.value = 5

filterComponent.print()
