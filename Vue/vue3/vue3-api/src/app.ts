import { defineComponent } from 'vue'
import Setup from '@/components/setup/index.vue'
import BaseReactiveApi from '@/components/base-reactive-api/index.vue'
import Lifecycle from '@/components/lifeCycle/index.vue'
import ProvideAndInject from '@/components/provideAndInject/index.vue'

export default defineComponent({
    components: {
        Setup,
        BaseReactiveApi,
        Lifecycle,
        ProvideAndInject
    }
})
