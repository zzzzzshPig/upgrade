<template>
  <div class="promise">
    <slot name="rejected" v-if="promised.status === 2"></slot>

    <slot name="default" v-if="promised.status === 1"></slot>

    <slot name="pending" v-if="loading.show"></slot>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
