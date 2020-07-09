<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">

        <!-- root不再只限制一个 -->
        <fragment :data="[6,2,8,9,5,1,3,4,7,0]"></fragment>
        
        <!-- teleport 渲染vue的组件内容，到指定的dom节点 -->
        <teleport v-if="false" to="body">
            <div class="modal">
                <div class="content">
                    <div class="title">
                        这是一个被插入在body下面的弹窗
                    </div>
                    
                    <div class="text">
                        teleport真香
                    </div>
                </div>
            </div>
        </teleport>
        
        <!-- suspense 异步等待组件 -->
        <suspense>
            <template #default>
                <suspenseTest></suspenseTest>
            </template>
            
            <template #fallback>
                lading
            </template>
        </suspense>
    
        <!-- todo小demo -->
        <todo></todo>
    </div>
</template>

<script>
import fragment from './components/fragment/index.vue'
import suspenseTest from './components/suspense/index.vue'
import todo from './components/todo/index.vue'

export default {
    name: 'App',
    components: {
        fragment,
		suspenseTest,
		todo
    }
}
</script>

<style scoped>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .8);
    }
    
    .modal .content {
        width: 300px;
        height: 200px;
        padding: 16px;
        background: #fff;
        text-align: center;
        border-radius: 4px;
    }
    
    .modal .content .title {
        margin-bottom: 16px;
    }
</style>
