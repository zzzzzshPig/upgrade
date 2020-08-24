import { defineComponent, ref, reactive, onMounted, onBeforeUpdate } from 'vue'

export default defineComponent({
    setup () {
        const root = ref<HTMLDivElement>()
        const roots = ref<HTMLDivElement[]>([])
        const lists = reactive([1, 2, 3, 4, 5])

        onMounted(() => {
            console.log('root ----- ', root.value)
            console.log('roots ---- ', roots.value)
        })

        // 确保在每次变更之前重置引用
        // 如果 lists 的内容发生了变化，比如lists.length发生变化
        // 那就必须清空roots(直接清空最为方便) 否则roots.length !== lists.length
        onBeforeUpdate(() => {
            roots.value = []
        })

        return {
            root,
            roots,
            lists,
            removeListsItem () {
            	lists.pop()
            },
            getEl (el: HTMLDivElement, index: number) {
            	// TODO: 重大bug list被删除了一个元素 但是getEl却被调用了lists.length + 1次
            	console.log(el, index)
                roots.value[index] = el
            }
        }
    }
})
