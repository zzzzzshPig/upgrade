<template>
	<div>
		unref1: {{ unref1.a }}
		<button @click="unref1.a = 2">change unref1</button>
	</div>

	<div>
		unref2: {{ unref2 }}
		<button @click="unref2 = 2">change unref2</button>
	</div>

	<div>
		toRef1.a: {{toRef1.a}} - {{toRef1RefA}}
		<button @click="toRef1.a++">change toRef1.a</button>
		<button @click="toRef1RefA++">change toRef1RefA</button>
	</div>

	<div>
		toRef1.b: {{toRef1.b}} - {{toRef1RefB}}
		<button @click="toRef1.b++">change toRef1.b</button>
		<button @click="toRef1RefB++">change toRef1RefB.b</button>
	</div>

	<div>
		toRefs1: {{ toRefs1 }}
		<button @click="toRefs1.a = toRefs1.b++">change toRefs1</button>
	</div>

	<div>
		toRefs2: {{ toRefs2.a }} - {{ toRefs2.b }} <span style="font-size: 12px;color: red;">注意这里的问题，模板没有对.a和.b进行解析</span>
	</div>

	<div>
		toRefs3: {{ toRefs3.a }} - {{ toRefs3.b }} <span style="font-size: 12px;color: red;">对toRefs2包裹了一层ref后可以正常解析，应该是bug</span>
	</div>

	<div>
		isRef1: {{ isRef1 }}
	</div>

	<div>
		isRef2: {{ isRef2 }}
	</div>

	<div>
		isProxy1: {{ isProxy1 }}
	</div>

	<div>
		isProxy2: {{ isProxy2 }}
	</div>

	<div>
		isProxy3: {{ isProxy3 }}
	</div>

	<div>
		isReactive1: {{ isReactive1 }}
	</div>

	<div>
		isReactive2: {{ isReactive2 }}
	</div>

	<div>
		isReactive3: {{ isReactive3 }}
	</div>

	<div>
		isReadonly1: {{ isReadonly1 }}
	</div>

	<div>
		isReadonly2: {{ isReadonly2 }}
	</div>

	<div>
		isReadonly3: {{ isReadonly3 }}
	</div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
