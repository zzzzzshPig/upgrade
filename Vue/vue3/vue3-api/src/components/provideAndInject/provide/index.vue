<template>
	<div>
		provideRef: {{ provideRef }}

		<button @click="changeProvide">change provideRef</button>
	</div>

	<div>
		provideBase: {{ provideBase }}
	</div>

	<Inject></Inject>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
