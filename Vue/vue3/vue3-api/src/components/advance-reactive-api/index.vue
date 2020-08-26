<template>
	<div>
		customerRef1: <input v-model="customerRef1" /> {{ customerRef1 }}
	</div>

	<div>
		markRaw1: {{ markRaw1.a }}
		<button @click="markRaw1.a++">change markRaw1</button>
		<span class="tips">点击按钮会修改markRaw1.a的值，但是不会更新view</span>
	</div>

	<div>
		markRaw2: {{ markRaw2.a }}
		<button @click="markRaw2.a++">change markRaw2</button>
		<span class="tips">点击按钮会修改markRaw2.a的值，会更新view，并且更新markRaw1.a</span>
	</div>

	<div>
		shallowReactive1: a: {{shallowReactive1.a}}
		<button @click="shallowReactive1.a++">change shallowReactive1.a</button>
	</div>

	<div>
		shallowReactive1: c: {{shallowReactive1.b.c}}
		<button @click="shallowReactive1.b.c++">change shallowReactive1.b.c</button>
		<span class="tips">只是没有reactive，值还是会修改，当组件重新渲染的时候会重新赋值</span>
	</div>

	<div>
		shallowReadonly1: a: {{shallowReadonly1.a}}
		<button @click="shallowReadonly1.a++">change shallowReadonly1.a</button>
		<span class="tips">修改这个值会报错</span>
	</div>

	<div>
		shallowReadonly1: c: {{shallowReadonly1.b.c}}
		<button @click="shallowReadonly1.b.c++">change shallowReadonly1.b.c</button>
		<span class="tips">只是没有reactive，值还是会修改，当组件重新渲染的时候会重新赋值</span>
	</div>

	<div>
		shallowRef1: {{shallowRef1}}
		<button @click="shallowRef1++">change shallowRef1</button>
	</div>

	<div>
		shallowRef2: {{shallowRef2.a}}
		<button @click="shallowRef2.a++">change shallowRef2</button>
		<span class="tips">只是没有reactive，值还是会修改，当组件重新渲染的时候会重新赋值</span>
	</div>

	<div>
		shallowRef3: {{shallowRef3.a}}
		<button @click="shallowRef3.a++">change shallowRef3</button>
	</div>

	<div>
		toRaw1: {{toRaw1.a}}
		<button @click="toRaw1.a++">change toRaw1</button>
	</div>

	<div>
		toRaw2: {{toRaw2.a}}
		<button @click="toRaw2.a++">change toRaw2</button>
		<span class="tips">只是没有reactive，值还是会修改，当组件重新渲染的时候会重新赋值</span>
	</div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
