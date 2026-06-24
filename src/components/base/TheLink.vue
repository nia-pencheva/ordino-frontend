<template>
    <span
        class="the-link"
        @click="emit('click')"
    >
        <slot></slot>
    </span>
</template>

<script setup lang="ts">
    const emit = defineEmits([ "click" ]);
</script>

<style lang="scss">
    .the-link {
        cursor: pointer;
        color: #2d5aa0;
        text-decoration: underline;

        &:hover {
            color: #1a3d7a;
        }
    }
</style>