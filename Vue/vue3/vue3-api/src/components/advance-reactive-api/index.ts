import { defineComponent, ref, reactive, customRef, markRaw, shallowReactive, shallowReadonly, shallowRef, toRaw } from 'vue'

function useDebouncedRef (value: string, delay = 200) {
    let timeout!: number
    return customRef((track, trigger) => {
        return {
            get () {
                track()
                return value
            },
            set (newValue: string) {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    value = newValue
                    trigger()
                }, delay)
            }
        }
    })
}

export default defineComponent({
    setup () {
    	const customerRef1 = useDebouncedRef('我是初始值')

        const markRaw1 = reactive(markRaw({ a: 1 }))
        const markRaw2 = reactive({ a: 1 })

        const shallowReactive1 = shallowReactive({
            a: 1,
            b: {
                c: 1
            }
        })
        const shallowReadonly1 = shallowReadonly({
            a: 1,
            b: {
                c: 1
            }
        })

        const shallowRef1 = shallowRef(1)
        const shallowRef2 = shallowRef({ a: 1 })
        const shallowRef3 = ref({ a: 1 })

        const toRaw1 = reactive({ a: 1 })
        const toRaw2 = toRaw(reactive({ a: 1 }))

        return {
            customerRef1,
            markRaw1,
            markRaw2,
            shallowReactive1,
            shallowReadonly1,
            shallowRef1,
            shallowRef2,
            shallowRef3,
            toRaw1,
            toRaw2
        }
    }
})
