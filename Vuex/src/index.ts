/*
* {
*   state: {
*       count: 1
*   },
*   getters: {
*       something (state) {
*           return state.count + 1
*       }
*   },
*   mutations: {
*       something (state) {
*           state.count++
*       }
*   },
*   actions: {
*       something (ctx) {
*           ctx.commit('something')
*       }
*   },
* }
* */

interface Context {
	state: object
	getters?: object
	mutations?: object
	actions?: object
}

interface Store {
	state: Object
	commit: {
		(type: string, payload: any): void
	}
	dispatch: {
		<T>(type: string, payload: any): Promise<T>
	}
}

let store = {}

export function createStore (ctx: Context) {}
