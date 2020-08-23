<template>
	<div class="base-reactive-api-component">
		<div>
			reactive1: {{ reactive1.reactive }}

			<button @click="reactive1.reactive += '1'">
				click me
			</button>
		</div>

		<div>
			ref1: {{ ref1 }}

			<button @click="ref1 += 1">
				click me
			</button>
		</div>

		<div>
			ref2: {{ ref2 }}

			<button @click="ref2 += '1'">
				click me
			</button>
		</div>

		<div>
			ref3: {{ ref3.ref }}

			<button @click="ref3.ref += 1">
				click me
			</button>
		</div>

		<div>
			computed1: {{ computed1 }}
		</div>

		<div>
			computed2: {{ computed2 }}

			<button @click="computed2 = 0">
				reset value
			</button>
		</div>

		<div>
			readonly1: {{ readonly1 }}
		</div>

		<div>
			readonly2: {{ readonly2 }}
		</div>

		<div>
			readonly3: {{ readonly3.ref }}
		</div>
	</div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less"></style>
