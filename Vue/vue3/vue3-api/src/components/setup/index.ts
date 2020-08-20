import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        setup: String
    },

    setup (props, ctx) {
        console.log(props.setup, ctx.attrs, ctx.slots)
    }
})
