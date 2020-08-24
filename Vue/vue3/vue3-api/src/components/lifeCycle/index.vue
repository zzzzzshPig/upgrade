<template>
	<Index v-if="show"></Index>

	<button @click="show = !show">{{show ? 'close' : 'open'}}</button>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
