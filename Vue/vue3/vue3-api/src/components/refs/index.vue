<template>
	<div ref="root">
		ref root
	</div>

	<div v-for="(item, index) in lists" :key="index" :ref="el => getEl(el, index)">
		list ref {{ item }}
	</div>

	<button @click="removeListsItem">remove lists item</button>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
