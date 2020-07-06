// 一个快排组件
import { sleep } from "../../utils";

export default {
	name: "suspense-test",
	async setup () {
		try {
			await sleep(3000)

			await Promise.reject()
		} catch (e) {
			console.log(e)
		}
		return {
			text: 'suspense-test'
		}
	}
}
