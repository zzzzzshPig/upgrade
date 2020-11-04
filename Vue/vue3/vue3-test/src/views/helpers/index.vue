<template>
  <div>{{ countdown.ing ? '正在倒计时' : '等待倒计时开始'}} : {{ countdown.time }}s</div>

  <button @click="countdown.start()"> 开始倒计时 </button>
  <button @click="countdown.end()"> 结束倒计时 </button>
</template>

<style lang="less">
</style>

<script lang="ts" src="./index.ts"></script>
