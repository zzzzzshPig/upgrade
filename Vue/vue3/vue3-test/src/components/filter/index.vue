<template>
    <div class="item" v-for="item in filters" :key="item.id">
        {{ item.text }}
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less">
</style>
