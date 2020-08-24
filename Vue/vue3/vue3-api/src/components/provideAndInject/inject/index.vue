<template>
	<div>
		injectRef: {{ injectRef }}

		<button @click="changeInject">change injectRef</button> <span style="font-size: 12px;color: red;">这个特性请慎重使用</span>
	</div>

	<div>
		injectBase: {{ injectBase }}
	</div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
