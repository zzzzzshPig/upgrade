import { defineComponent, reactive, ref, computed, readonly, watchEffect, watch, Ref } from 'vue'

function reactiveDemo () {
    // reactive 给对象用的
    // 类型判断最终还是ref
    const reactive1 = reactive({
        reactive: 'reactive1'
    })

    return {
        reactive1
    }
}

function refDemo () {
    // ref 给基础类型的值用
    // UnwrapRefSimple Function | Map | Set | WeakMap | WeakSet | string | boolean | number | Ref 类型的值直接返回
    // 数组则递归处理所有的子元素
    // 对象则递归处理所有的value
    const ref1 = ref(1)
    const ref2 = ref<string | number>(2)
    // value 被提出来了
    const ref3 = reactive({
        ref: ref1
    })
    const ref4 = ref({
        ref: ref1
    })

    return {
        ref1,
        ref2,
        ref3,
        ref4
    }
}

function computedDemo (ref1: Ref<number>) {
    // computed
    // 返回ref对象
    const computed1 = computed(() => ref1.value + 1)
    const computed2 = computed({
        get: () => {
            return computed1.value + 1
        },
        set (value) {
            ref1.value = value
        }
    })
    return {
    	computed1,
        computed2
    }
}

function readonlyDemo <T extends Ref, U extends Ref> (ref1: T, ref4: U) {
    // 虽然ref1 变成了只读的 但是修改它的值还是能改变readonly的值
    // 逻辑应该是没毛病的 相当于copy了一份ref1 并且把它变成只读的（从type上来说）
    // 但是在实际上并不是copy ref1的改变还是为引起readonly的变化 这里很容易出bug
    const readonly1 = readonly(ref1)
    // 解决办法是重新赋值
    const readonly2 = readonly(ref(ref1.value))
    // 如果ref1.value 是个对象 还是会有bug
    const readonly3 = readonly(ref(ref4.value))

    return {
        readonly1,
        readonly2,
        readonly3
    }
}

function watchEffectDemo<T extends Ref> (ref1: T) {
    watchEffect(() => {
        console.log('watchEffect1', ref1.value)
    })

    watchEffect((clear) => {
    	function getTimer (value: number) {
    		return setTimeout(() => {
                console.log('watchEffect2', value)
            }, 1000)
        }
        const timer = getTimer(ref1.value)

        // 防抖
        clear(() => {
        	clearTimeout(timer)
        })
    })
}

function watchDemo (ref1: Ref<number>, ref2: Ref<string | number>) {
    // watch需要显示的声明getter，其他的和watchEffect差不多

    watch(
    	// getter
        () => {
            return ref1.value
        },
        (n) => {
            console.log('watch1 ' + n)
        },
        {
            immediate: true
        }
    )

    watch(
    	// 直接监听值
    	[ref1, ref2],
        (n) => {
            console.log('watch2 ' + n)
        }
    )
}

export default defineComponent({
    setup () {
        const { ref1, ref2, ref3, ref4 } = refDemo()

        // 在setup中被调用 只要是同步的watchEffect 在组件被销毁的时候会自动销毁watch
        watchEffectDemo(ref1)

        watchDemo(ref1, ref2)

        return {
        	...reactiveDemo(),
            ref1,
            ref2,
            ref3,
            ...computedDemo(ref1), // TODO: type bug, readonly is not equal to ref
            ...readonlyDemo(ref1, ref4)
        }
    }
})
