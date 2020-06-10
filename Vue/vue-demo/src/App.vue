<template>
  <div id="app">
    <Promised :promise="testPromise" @resolve="testPromiseResolve" @reject="testPromiseReject">
      <template v-slot:rejected>
        reject
      </template>

      <template v-slot>
        resolve
      </template>

      <template v-slot:pending>
        pending
      </template>
    </Promised>

    <Promised2 :promise="testPromise">
      <template v-slot:rejected>
        reject
      </template>

      <template v-slot>
        resolve
      </template>

      <template v-slot:pending>
        pending
      </template>
    </Promised2>

    <button @click="changePromise">改变promise</button>
  </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style lang="less" scoped></style>
