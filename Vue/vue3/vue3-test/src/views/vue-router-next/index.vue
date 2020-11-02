<template>
  <router-link
    to="/vue-router-next"
    custom
    v-slot="{ href, route, navigate, isActive, isExactActive }"
  >
    <div
      :class="{
        active: isActive
      }"
      :href="href"
      @click="navigate">
      <div>
        fullPath: {{ route.fullPath }}
      </div>
      <div>
        isExactActive: {{isExactActive}}
      </div>
      <div>
        href: {{href}}
      </div>
      <div>
        route: {{route}}
      </div>
      <div>
        isActive: {{isActive}}
      </div>
    </div>
  </router-link>

  <router-view v-slot="{ Component, route }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="less">
  .active {
    font-weight: bold;
  }
</style>

<script lang="ts" src="./index.ts"></script>
