<template>
    <quick :data="left" v-if="left.length"></quick>
    <div>{{flag}}</div>
    <quick :data="right" v-if="right.length"></quick>
</template>

<script src="./index.js"></script>

<style scoped>
</style>
