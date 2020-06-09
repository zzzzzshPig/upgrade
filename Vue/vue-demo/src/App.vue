<template>
  <div id="app">
    <Promised :promise="testPromise" @resolve="testPromiseResolve" @reject="testPromiseReject">
      <template v-slot:rejected>
        error
      </template>

      <template v-slot>
        default
      </template>

      <template v-slot:pending>
        loading
      </template>
    </Promised>

    <Promised2 :promise="testPromise">
      <template v-slot:rejected>
        error
      </template>

      <template v-slot>
        default
      </template>

      <template v-slot:pending>
        loading
      </template>
    </Promised2>

    <button @click="changePromise">改变promise</button>
  </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style lang="less" scoped></style>
