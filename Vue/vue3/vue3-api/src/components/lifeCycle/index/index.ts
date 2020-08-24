import { defineComponent, ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered } from 'vue'
import ErrorComponent from '../error/index.vue'

export default defineComponent({
    components: {
        ErrorComponent
    },

    // The setup function is similar to beforeCreate and created in vue2.x
    setup () {
        // similar to beforeMount
        onBeforeMount(() => {
            console.log('onBeforeMount')
        })
        // similar to mounted
        onMounted(() => {
            console.log('onMounted')
        })
        // similar to beforeUpdate
        onBeforeUpdate(() => {
            console.log('onBeforeUpdate')
        })
        // similar to updated
        onUpdated(() => {
            console.log('onUpdated')
        })
        // similar to beforeDestroy
        onBeforeUnmount(() => {
            console.log('onBeforeUnmount')
        })
        // similar to destroyed
        onUnmounted(() => {
            console.log('onUnmounted')
        })
        // similar to errorCaptured
        onErrorCaptured((e) => {
            console.log('onErrorCaptured', e)
        })
        // new lifecycle
        onRenderTracked((e) => {
            console.log('onRenderTracked', e)
        })
        // new lifecycle
        onRenderTriggered((e) => {
            console.log('onRenderTriggered', e)
        })

        const count = ref(1)
        return {
            count,
            changeText () {
                count.value++
            }
        }
    }
})
