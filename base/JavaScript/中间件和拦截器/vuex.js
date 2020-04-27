
// simple vuex test
class Store {
    // init
    constructor (options) {
        this.actions = options.actions
        this.state = options.state
        this.beforeActions = []
        this.afterActions = []
    }

    // 订阅action的变化
    /*
    * options: {
    *   before: function // submit action before
    *   after: function // submit action after
    * }
    * */
    subscribeAction (options) {
        if (options.before) this.beforeActions.push(options.before)
        if (options.after) this.afterActions.push(options.after)
    }

    // 调用action
    async dispatch (name, payload) {
        // before
        this.runActionsQueue(this.beforeActions, name)
        await this.actions[name](this.state, payload)
        // after
        this.runActionsQueue(this.afterActions, name)
    }

    runActionsQueue (actions, name) {
        actions.forEach(a => {
            a(name, this.state)
        })
    }
}

const store = new Store({
    state: {
        count: 1
    },
    actions: {
        changeCount (state, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    state.count = payload
                    resolve()
                }, 2000)
            })
        }
    }
})

store.subscribeAction({
    before: (action, state) => {
        console.log(`before action ${action}, before count is ${state.count}`)
    },
    after: (action, state) => {
        console.log(`after action ${action},  after count is ${state.count}`)
    }
})

store.dispatch('changeCount', 2)
