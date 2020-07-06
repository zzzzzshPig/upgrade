import {reactive, toRefs} from 'vue'

export default {
	setup(){
		const state = reactive({
			newTodo:'',
			todos: [
				{ id: "1", title: "吃饭", completed: false },
				{ id: "2", title: "睡觉", completed: false }
			],
		})
		function addTodo(){
			let value = state.newTodo && state.newTodo.trim()
			if (!value) {
				return
			}
			state.todos.push({
				id: state.todos.length + 1,
				title: value,
				completed: false
			})
			state.newTodo = ""
		}
		function removeTodo (todo) {
			for (let i = 0; i < state.todos.length; i++) {
				if (state.todos[i].id === todo.id) {
					state.todos.splice(i, 1)
					break
				}
			}
		}
		return {
			...toRefs(state),
			addTodo,
			removeTodo
		}
	}
}
