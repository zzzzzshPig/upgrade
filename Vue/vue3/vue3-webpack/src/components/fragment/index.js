// 一个快排组件
export default {
	name: "quick",
	props: ['data'],
	setup (props) {
		// 选一个值做为中间值
		let flag = props.data[0]
		let left = []
		let right = []
		props.data.slice(1).forEach(a => {
			a > flag ? right.push(a) : left.push(a)
		})
		return {left, right, flag}
	}
}
