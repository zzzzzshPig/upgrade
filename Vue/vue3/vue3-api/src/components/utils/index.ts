import { defineComponent, readonly, reactive, ref, unref, toRef, toRefs, isRef, isProxy, isReactive, isReadonly } from 'vue'

export default defineComponent({
    setup () {
    	// 去掉了ref
        const unref1 = unref(ref(reactive({ a: 1 })))
        const unref2 = unref(ref(1))

        // 将reactive的某个属性变为ref
        const toRef1 = reactive({ a: 1, b: 2 })
        // 这两个效果应该差不多
        const toRef1RefA = toRef(toRef1, 'a')
        const toRef1RefB = ref(toRef1.b)
        toRef1.b = toRef1RefB as any

        // 把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应
        const toRefs1 = reactive({ a: 3, b: 4 })
        // TODO: 注意 这里 toRefs2 只是一个普通的对象，模板中调用的时候会有问题
        const toRefs2 = toRefs(toRefs1)
        // TODO: 必须包裹一层 ref 才可以在模板中正常使用，不用.value
        const toRefs3 = ref(toRefs2)

        // 检查一个值是否为一个 ref 对象
        const isRef1 = isRef(ref(1))
        const isRef2 = isRef(reactive({ a: 1 }))

        // 检查一个对象是否是由 reactive 或者 readonly 方法创建的代理
        const isProxy1 = isProxy(ref(1))
        const isProxy2 = isProxy(reactive({ a: 1 }))
        const isProxy3 = isProxy(readonly(ref(1)))

        // 检查一个对象是否是由 reactive 创建的响应式代理
        const isReactive1 = isReactive(reactive({ a: 1 }))
        const isReactive2 = isReactive(ref(1))
        const test1 = { a: 1 }
        const isReactive3 = isReactive(readonly(test1))

        // 检查一个对象是否是由 readonly 创建的只读代理
        const isReadonly1 = isReadonly(ref(1))
        const isReadonly2 = isReadonly(reactive({ a: 1 }))
        const isReadonly3 = isReadonly(readonly({ a: 1 }))

        return {
        	unref1,
            unref2,
            toRef1,
            toRef1RefA,
            toRef1RefB,
            toRefs1,
            toRefs2,
            toRefs3,
            isRef1,
            isRef2,
            isProxy1,
            isProxy2,
            isProxy3,
            isReactive1,
            isReactive2,
            isReactive3,
            isReadonly1,
            isReadonly2,
            isReadonly3
        }
    }
})
